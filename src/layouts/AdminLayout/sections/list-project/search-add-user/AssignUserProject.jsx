import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { applyFilterByUser } from '../utils'
import {
  Avatar,
  Box,
  Card,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Iconify from '../../../components/iconify'
import {
  assignUserProjectAPI,
  getUserListAPI,
} from '../../../../../apis/userAPI'
import Swal from 'sweetalert2'

const AssignUserProject = ({ projectId, members, handleCloseMenu }) => {
  const queryClient = useQueryClient()
  const [filterName, setFilterName] = useState('')

  // start get list user
  const { data: userList = [] } = useQuery({
    queryKey: ['get-list-user'],
    queryFn: () => getUserListAPI(),
  })
  // end get list user

  // start assign user
  const { mutate: assignUser } = useMutation({
    mutationFn: (values) => assignUserProjectAPI(values),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Member added to the project successfully!',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries(['members'])

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

  const handleAssignUser = (userId) => {
    handleCloseMenu()
    Swal.fire({
      icon: 'warning',
      title: 'Do you want to add this member to the project?',
      confirmButtonText: 'OK',
      showDenyButton: true,
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        assignUser({ projectId, userId })
      }
      return
    })
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
  }

  const dataUser = applyFilterByUser({
    inputData: userList,
    filterName,
  })
  return (
    <>
      <Card>
        <Box sx={{ p: 1 }}>
          <OutlinedInput
            value={filterName}
            onChange={handleFilterByName}
            fullWidth
            placeholder="Search user name..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
        </Box>

        {filterName && filterName.length > 0 && (
          <TableContainer sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Avatar</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dataUser?.map((user) => (
                  <TableRow
                    key={user.userId}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {user.userId}
                    </TableCell>
                    <TableCell align="right">{user.name}</TableCell>
                    <TableCell align="right">
                      <Stack direction={'row'} alignItems={'center'}>
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{ mr: 1, width: 32, height: 32 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          handleAssignUser(user.userId)
                        }}
                      >
                        <Iconify icon="eva:plus-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </>
  )
}

export default AssignUserProject
