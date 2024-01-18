import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { removeUserTaskAPI } from '../../../../../../apis/taskAPI'
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
import Iconify from '../../../../components/iconify'
import Swal from 'sweetalert2'

const RemoveUserTask = ({ listTask, handleCloseMenu }) => {
  const queryClient = useQueryClient()

  const { mutate: removeUserTask } = useMutation({
    mutationFn: (id) => removeUserTaskAPI(id),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Remove user from task successfully',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries('get-list-project-detail-by-id')
          handleCloseMenu()
        }
      })
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

  const handleRemoveUser = (id) => {
    handleCloseMenu()
    Swal.fire({
      icon: 'warning',
      title: 'Do you want to remove user from the task?',
      confirmButtonText: 'OK',
      showDenyButton: true,
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeUserTask({ taskId: listTask.taskId, userId: id })
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
          {listTask.assigness?.map((member) => {
            return (
              <TableRow
                key={member.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {member.id}
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
                      handleRemoveUser(member.id)
                    }}
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RemoveUserTask
