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
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import ModalView from '../../components/modal/modal'
import { deleteUserAPI } from '../../../../apis/userAPI'
import { LoadingButton } from '@mui/lab'
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  userId,
  name,
  email,
  avatar,
  phoneNumber,
  handleClick,
}) {
  const queryClient = useQueryClient()

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
    mutationFn: (userId) => deleteUserAPI(userId),
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
        title: error.response?.data?.content || 'Có lỗi xảy ra khi xóa user.',
        confirmButtonText: 'Đồng ý',
      })
    },
  })

  const handleDeleteUser = (userId) => {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn muốn xóa user này?',
      confirmButtonText: 'Đồng ý',
      showDenyButton: true,
      denyButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId)
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

        <TableCell>{email}</TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>
          <Avatar
            src={avatar}
            alt={name}
            sx={{ mr: 1, width: 32, height: 32 }}
          />
        </TableCell>

        <TableCell>{phoneNumber}</TableCell>

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
          <LoadingButton
            loading={isPending}
            sx={{ color: 'error.main' }}
            fullWidth
            onClick={() => handleDeleteUser(userId)}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </LoadingButton>
        </MenuItem>
      </Popover>
      <ModalView open={openModal} handleClose={handleCloseModal}>
        {/* <UserEdit userId={userId} /> */}
      </ModalView>
    </>
  )
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  userId: PropTypes.any,
  name: PropTypes.any,
  email: PropTypes.any,
  phoneNumber: PropTypes.any,
  avatar: PropTypes.any,
}
