import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import Label from '../../../components/label'
import PopOver from '../../../components/popover/PopOver'
import Iconify from '../../../components/iconify'
import ModalView from '../../../components/modal/modal'
import RemoveUserTask from './RemoveUserTask'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { removeTaskAPI } from '../../../../../apis/taskAPI'

import EditTask from '../edit-task'
import { LoadingButton } from '@mui/lab'

const ListTask = ({ task }) => {
  const queryClient = useQueryClient()
  const [selectedPopover, setSelectedPopover] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => setOpenModal(false)

  const handleOpenMenu = (event, type) => {
    setOpenMenu(event.currentTarget)
    setSelectedPopover(type)
  }

  const handleCloseMenu = (type) => {
    setOpenMenu(null)
    // setSelectedPopover(type)
  }

  const { mutate: removeTask, isPending } = useMutation({
    mutationFn: (id) => removeTaskAPI(id),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Remove task successfully',
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

  const handleRemoveTask = (id) => {
    handleCloseMenu()
    Swal.fire({
      icon: 'warning',
      title: 'Do you want to remove task from the project?',
      confirmButtonText: 'OK',
      showDenyButton: true,
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeTask(id)
      }
      return
    })
  }

  return (
    <>
      <Box key={task.taskId}>
        <Card sx={{ my: 1 }}>
          <CardHeader
            sx={{
              p: '0.5rem 1rem',
            }}
            title={
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: '#212B36',
                  fontWeight: 'bold',
                }}
                className={'truncate'}
              >
                {task.taskName}
              </Typography>
            }
            action={
              <IconButton
                onClick={(event) => {
                  handleOpenMenu(event, 'action')
                }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            }
          />
          <CardContent>
            <Stack
              direction="row"
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Label
                color={
                  task.priorityTask.priority === 'High'
                    ? 'error'
                    : task.priorityTask.priority === 'Medium'
                    ? 'warning'
                    : task.priorityTask.priority === 'Low'
                    ? 'success'
                    : 'default'
                }
                sx={{ fontSize: '1rem' }}
              >
                {task.priorityTask.priority}
              </Label>
              <Stack direction={'row'}>
                <AvatarGroup
                  max={2}
                  sx={{ cursor: 'pointer' }}
                  onClick={(event) => {
                    handleOpenMenu(event, 'removeUser')
                  }}
                >
                  {task.assigness?.map((assign) => (
                    <Avatar
                      key={assign.id}
                      src={assign.avatar}
                      alt={assign.name}
                      // sx={{ width: 35, height: 35 }}
                    />
                  ))}
                </AvatarGroup>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <PopOver
        openMenu={openMenu}
        handleCloseMenu={handleCloseMenu}
        selectedPopover={selectedPopover}
      >
        {selectedPopover === 'action' ? (
          <Stack
            direction={'column'}
            alignItems={'center'}
            sx={{ width: '120px', p: 1 }}
            spacing={0.3}
          >
            <Button
              fullWidth
              onClick={() => {
                handleOpenModal()
                handleCloseMenu()
              }}
              size="large"
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
              Edit
            </Button>
            <LoadingButton
              sx={{
                color: 'error.main',
                display: 'flex',
                alignItems: 'center',
              }}
              fullWidth
              size="large"
              loading={isPending}
              onClick={() => {
                handleRemoveTask(task.taskId)
              }}
            >
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              Delete
            </LoadingButton>
          </Stack>
        ) : (
          <RemoveUserTask listTask={task} handleCloseMenu={handleCloseMenu} />
        )}
      </PopOver>

      <ModalView open={openModal} handleClose={handleCloseModal}>
        <EditTask
          taskId={task.taskId}
          handleClose={handleCloseModal}
          handleCloseMenu={handleCloseMenu}
        />
      </ModalView>
    </>
  )
}

export default ListTask
