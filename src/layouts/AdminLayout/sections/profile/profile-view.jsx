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
import {
  UserProvider,
  useAuth,
} from '../../../../context/UserContext/UserContext'
import { Avatar } from '@mui/material'
import { useForm } from 'react-hook-form'
import ModalView from '../../components/modal/modal'
import { useMutation } from '@tanstack/react-query'
import { editUserAPI } from '../../../../apis/userAPI'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

// ----------------------------------------------------------------------

export default function ProfileView() {
  const { currentUser, handleLogout } = useAuth()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const theme = useTheme()

  const [userEdit, setUserEdit] = useState(null)

  const schemaEditUser = yup.object({
    email: yup
      .string()
      .email('Vui lòng nhập đúng định dạng email')
      .required('Vui lòng nhập email'),

    password: !userEdit
      ? yup.string()
      : yup.string().required('Vui lòng nhập mật khẩu'),
  })

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { isSubmitSuccessful, errors },
  } = useForm({ resolver: yupResolver(schemaEditUser) })

  const handleEditUser = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn cập nhật thông tin ?',
      confirmButtonText: 'Đồng ý',
      showDenyButton: true,
      denyButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        setUserEdit(getValues())
        handleUpdateUser({ ...getValues() })
      }
      return
    })
  }

  const { mutate: handleUpdateUser, isPending } = useMutation({
    mutationFn: (data) => editUserAPI(data),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công',
        confirmButtonText: 'Đồng ý',
      }).then((result) => {
        if (result.isConfirmed) {
          setUserEdit(null)
          handleLogout()
        }
        return
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật user thất bại',
        text: error.response.data.content || 'Có lỗi xảy ra khi thêm user.',
        confirmButtonText: 'Đồng ý',
      })
    },
  })
  useEffect(() => {
    setValue('id', currentUser.id || ' ')
    setValue('email', currentUser.email || ' ')
    setValue('phoneNumber', currentUser.phoneNumber || ' ')
    setValue('name', currentUser.name || ' ')
    setValue('password', '')
  }, [setValue, isSubmitSuccessful])

  const onSubmit = () => {
    if (userEdit) {
      handleEditUser()
    } else {
      setUserEdit(true)
    }
  }
  const renderForm = (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            disabled
            name="id"
            value={currentUser.id}
            label="ID"
            {...register('id')}
          />
          <TextField
            disabled
            name="email"
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={Boolean(errors.email) && errors.email.message}
            {...register('email')}
            value={currentUser.email}
            label="Email Address"
          />
          <TextField
            disabled={!userEdit}
            name="name"
            label="Full Name"
            {...register('name')}
          />

          <TextField
            disabled={!userEdit}
            name="phoneNumber"
            {...register('phoneNumber')}
            label="Phone Number"
          />
          <TextField
            type="password"
            disabled={!userEdit}
            name="password"
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={Boolean(errors.password) && errors.password.message}
            {...register('password')}
            label="Password"
          />
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          sx={{ my: 3 }}
        >
          {!userEdit ? 'Edit Profile' : 'Update'}
        </LoadingButton>
      </form>
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

      <Stack alignItems="center" justifyContent="center" sx={{ width: '40%' }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            alt={currentUser.name}
            src={currentUser.avatar}
            sx={{ width: 125, height: 125, textAlign: 'center' }}
          />
          <Typography variant="h5" sx={{ py: 5 }}>
            {currentUser.name}
          </Typography>
        </Card>
      </Stack>
      <Stack alignItems="left" justifyContent="left" sx={{ width: '50%' }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            height: 600,
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
