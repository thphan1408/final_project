import {
  Avatar,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { signupAPI } from '../../../apis/userAPI'
import { PATH } from '../../../routes/path'
import { LoadingButton } from '@mui/lab'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Lottie from 'react-lottie'
import defaultOptions from '../../../utils/Lotties/OptionsLottie'

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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme()

// Validate
// const schemaSignup = yup.object({
//   taiKhoan: yup
//     .string()
//     .required('Vui lòng nhập thông tin')
//     .min(6, 'Tài khoản ít nhất 6 ký tự')
//     .max(8, 'Tài khoản không quá 8 ký tự'),
//   matKhau: yup
//     .string()
//     .required('Vui lòng nhập thông tin')
//     .matches(
//       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
//       'Mật khẩu ít nhất 8 ký tự và bao gồm 1 ký tự đặc biệt, 1 ký tự viết hoa và viết thường'
//     ),
//   hoTen: yup.string().required('Vui lòng nhập thông tin'),
//   email: yup.string().required('Vui lòng nhập thông tin'),
//   soDt: yup.string().required('Vui lòng nhập thông tin'),
// })

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

const SignUp = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      passWord: '',
      name: '',
      phoneNumber: '',
    },
    // mode: 'all',
    // resolver: yupResolver(schemaSignup),
  })

  const { mutate: handleSignUp, isPending } = useMutation({
    mutationFn: (values) => signupAPI(values),
    onSuccess: () => {
      navigate(PATH.ROOT)
    },
    onError: (error) => {
      let errorMessage = 'Đã xảy ra lỗi khi đăng ký.'

      if (error.response) {
        const errorData = error.response.data
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.content && errorData.content.email) {
          errorMessage = 'Email đã được sử dụng!'
        }
      }

      showErrorToast(error.message)
    },
  })

  const onSubmit = (values) => {
    handleSignUp(values)
  }

  return isPending ? (
    <Lottie
      options={defaultOptions}
      style={{
        width: '40%',
        height: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
      }}
    />
  ) : (
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
            Sign up
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="full-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  {...register('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register('email')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="phone"
                  {...register('phoneNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('passWord')}
                />
              </Grid>
              {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid> */}
            </Grid>
            <LoadingButton
              loading={isPending}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}

export default SignUp
