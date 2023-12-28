import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import { Box, Grid, Stack, TextField, MenuItem } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { editUserApi, infoUserAPI } from '../../../../../apis/userAPI'
import { GROUP_CODE } from '../../../../../constants'
import Swal from 'sweetalert2'
import { Button } from 'flowbite-react'
import { LoadingButton } from '@mui/lab'

const EditUser = ({ taiKhoan }) => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { isSubmitSuccessful },
  } = useForm()

  const { data = {} } = useQuery({
    queryKey: ['get-user-details', taiKhoan],
    queryFn: () => infoUserAPI(taiKhoan),
    enabled: !!taiKhoan,
  })

  const handleEditUser = (data) => {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn cập nhật thông tin người dùng này?',
      confirmButtonText: 'Đồng ý',
      showDenyButton: true,
      denyButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateUser(data)
      }
      return
    })
  }
  const queryClient = useQueryClient()

  const { mutate: handleUpdateUser, isPending } = useMutation({
    mutationFn: async (data) => {
      await editUserApi(data)
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công',
        confirmButtonText: 'Đồng ý',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries('get-list-user')
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
    setValue('taiKhoan', data.taiKhoan || ' ')
    setValue('matKhau', data.matKhau || ' ')
    setValue('email', data.email || ' ')
    setValue('soDT', data.soDT || ' ')
    setValue('maNhom', GROUP_CODE || ' ')
    setValue('maLoaiNguoiDung', data.maLoaiNguoiDung || ' ')
    setValue('hoTen', data.hoTen || ' ')
  }, [data, setValue, isSubmitSuccessful])

  const onSubmit = (formData) => {
    handleEditUser(formData)
  }

  return (
    <Box>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        spacing={3}
      >
        <Grid item md={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} direction={'column'}>
              <TextField
                label="Tài khoản"
                fullWidth
                disabled
                {...register('taiKhoan')}
              />

              <TextField label="Họ tên" fullWidth {...register('hoTen')} />

              <TextField label="Email" fullWidth {...register('email')} />
              <TextField
                label="Số điện thoại"
                fullWidth
                {...register('soDT')}
              />
              <Controller
                control={control}
                name="maLoaiNguoiDung"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Loại người dùng"
                    {...field}
                  >
                    <MenuItem value="QuanTri">Quản Trị</MenuItem>
                    <MenuItem value="KhachHang">Khách Hàng</MenuItem>
                  </TextField>
                )}
              />

              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                {...register('matKhau')}
              />

              <LoadingButton
                disabled={isPending}
                variant="contained"
                size="large"
                type="submit"
              >
                Cập nhật người dùng
              </LoadingButton>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

EditUser.propTypes = {
  taiKhoan: PropTypes.string.isRequired,
}

export default EditUser
