import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import { alpha, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

import { bgGradient } from '../../themes/css'

import Logo from '../../components/logo'
import Iconify from '../../components/iconify'
import { UserProvider } from '../../../../context/UserContext/UserContext'
import { Avatar } from '@mui/material'
import { useForm } from 'react-hook-form'

// ----------------------------------------------------------------------

export default function ProfileView() {
  const theme = useTheme()

  const [userEdit, setUserEdit] = useState(true)
  const handleUpdate = () => {
    setUserEdit(false)
  }
  const user = JSON.parse(localStorage.getItem('CURRENT_USER'))
  console.log('user: ', user)

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { isSubmitSuccessful },
  } = useForm()

  useEffect(() => {
    setValue('email', user.email || ' ')
    setValue('phoneNumber', user.phoneNumber || ' ')
    setValue('fullName', user.name || ' ')
  }, [setValue, isSubmitSuccessful])

  const onSubmit = () => {
    console.log('abc')
  }
  const renderForm = (
    <>
      {' '}
      <Stack spacing={3}>
        {' '}
        <TextField
          disabled={userEdit}
          name="fullName"
          label="Full Name"
          {...register('fullName')}
        />
        <TextField
          disabled={userEdit}
          name="email"
          {...register('email')}
          label="Email Address"
        />
        <TextField
          disabled={userEdit}
          name="phoneNumber"
          {...register('phoneNumber')}
          label="Phone Number"
        />
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        sx={{ my: 3 }}
        onClick={userEdit ? handleUpdate : onSubmit}
      >
        {userEdit ? 'Edit Profile' : 'Update'}
      </LoadingButton>
    </>
  )

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 550, width: '40%' }}
      >
        <Card
          sx={{
            p: 5,
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{ width: 125, height: 125, textAlign: 'center' }}
          />
          <Typography variant="h5" sx={{ py: 5 }}>
            {user.name}
          </Typography>
        </Card>
      </Stack>
      <Stack
        alignItems="left"
        justifyContent="left"
        sx={{ minHeight: 550, width: '50%' }}
      >
        <Card
          sx={{
            p: 5,
            width: 1,
          }}
        >
          <Typography variant="h4" sx={{ textAlign: 'center', pb: 5 }}>
            User Information
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  )
}
