import { useState } from 'react'
import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import Label from '../../components/label'
import Iconify from '../../components/iconify'
import { Button, TextField } from '@mui/material'
import ModalView from '../modal/modal'
import UserEdit from '../user/edit-user'
import { deleteUserAPI } from '../../../../apis/userAPI'
import { QueryClient, useMutation } from '@tanstack/react-query'
import Swal from 'sweetalert2'
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  taiKhoan,
  hoTen,
  email,
  soDT,
  matKhau,
  maLoaiNguoiDung,
  handleClick,
}) {
  const queryClient = new QueryClient()
  const userInfor = {
    taiKhoan,
    hoTen,
    email,
    soDT,
    matKhau,
    maLoaiNguoiDung,
  }
  const [open, setOpen] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpen(null)
  }
  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async (taiKhoan) => {
      await deleteUserAPI(taiKhoan)
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Xóa user thành công',
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
        title: 'Xóa user thất bại',
        text: error.response.data.content || 'Có lỗi xảy ra khi xóa user.',
        confirmButtonText: 'Đồng ý',
      })
    },
  })
  const handleDeleteUser = (taiKhoan) => {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn muốn xóa user này?',
      confirmButtonText: 'Đồng ý',
      showDenyButton: true,
      denyButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(taiKhoan)
      }
      return
    })
  }
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{taiKhoan}</TableCell>

        <TableCell>{hoTen}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{soDT}</TableCell>

        <TableCell>{maLoaiNguoiDung}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140, textAlign: 'right' },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Button fullWidth onClick={handleOpenModal}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </Button>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <Button
            sx={{ color: 'error.main' }}
            fullWidth
            onClick={() => handleDeleteUser(taiKhoan)}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </Button>
        </MenuItem>
      </Popover>
      <ModalView open={openModal} handleClose={handleCloseModal}>
        <UserEdit taiKhoan={taiKhoan} />
      </ModalView>
    </>
  )
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  maLoaiNguoiDung: PropTypes.any,
  matKhau: PropTypes.any,
  soDT: PropTypes.any,
  taiKhoan: PropTypes.any,
  hoTen: PropTypes.any,
  email: PropTypes.string,
}
