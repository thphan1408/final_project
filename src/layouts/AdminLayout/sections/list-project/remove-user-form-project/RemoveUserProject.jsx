import {
  Avatar,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import Iconify from '../../../components/iconify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeUserProjectAPI } from '../../../../../apis/userAPI'
import Swal from 'sweetalert2'

const RemoveUserProject = ({ members, projectId, handleCloseMenu }) => {
  const queryClient = useQueryClient()

  const { mutate: removeMember } = useMutation({
    mutationFn: (values) => removeUserProjectAPI(values),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Remove member success!',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries(['members'])
        }
      })
      handleCloseMenu()
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: error.content,
        text: error.message,
        confirmButtonText: 'Ok',
      })
    },
  })

  const handleRemoveMember = (userId) => {
    handleCloseMenu()

    Swal.fire({
      icon: 'warning',
      title: 'Do you want to remove this member from the project?',
      confirmButtonText: 'OK',
      showDenyButton: true,
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeMember({ projectId, userId })
      }
      return
    })
  }

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Avatar</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.userId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {member.userId}
              </TableCell>
              <TableCell align="right">{member.name}</TableCell>
              <TableCell align="right">
                <Stack direction={'row'} alignItems={'center'}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ mr: 1, width: 32, height: 32 }}
                  />
                </Stack>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    handleRemoveMember(member.userId)
                  }}
                >
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RemoveUserProject
