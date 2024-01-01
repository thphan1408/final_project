import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import React from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { signinAPI } from '../../../apis/userAPI'
import { PATH } from '../../../constants/path'
import { LoadingButton } from '@mui/lab'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Lottie from 'react-lottie'
import defaultOptions from '../../../utils/Lotties/OptionsLottie'
import { useAuth } from '../../../context/UserContext/UserContext'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link style={{ color: 'rgba(0, 0, 0, 0.6)' }} to="#">
        Jira Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const defaultTheme = createTheme()

// Validate
const schemaSignIn = yup.object({
  email: yup
    .string()
    .email('Vui lòng nhập đúng định dạng email')
    .required('Vui lòng nhập email'),
  passWord: yup.string().required('Vui lòng nhập mật khẩu'),
})

const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

const SignIn = () => {
  const navigate = useNavigate()
  const { currentUser, handleSignin: handleSigninContext } = useAuth()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      passWord: '',
    },
    mode: 'all',
    resolver: yupResolver(schemaSignIn),
  })

  const { mutate: handleSignin, isPending } = useMutation({
    mutationFn: (value) => {
      return signinAPI(value)
    },
    onSuccess: (values) => {
      handleSigninContext(values)
      navigate(PATH.ADMIN)
      toast.success('Đăng nhập thành công')
    },
    onError: (error) => {
      if (error.status === 404) {
        showErrorToast('Tài khoản email không tồn tại.')
      } else if (error.status === 401) {
        showErrorToast('Tài khoản hoặc mật khẩu không đúng.')
      } else {
        showErrorToast('Đã xảy ra lỗi khi đăng nhập.')
      }
    },
  })

  const onSubmit = (values) => {
    handleSignin(values)
  }

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={Boolean(errors.email) && errors.email.message}
                {...register('email')}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(errors.passWord)}
                helperText={Boolean(errors.passWord) && errors.passWord.message}
                {...register('passWord')}
              />
              {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
              <LoadingButton
                loading={isPending}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </LoadingButton>
              <Grid container>
                {/* <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid> */}
                <Grid item>
                  <Link to="/sign-up" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>

          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  )
}

export default SignIn
