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
import AssignUserTask from './AssignUserTask'
import RemoveUserTask from './RemoveUserTask'
import TaskDetail from './TaskDetail'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { removeTaskAPI } from '../../../../../apis/taskAPI'
import EditTask from '../edit-task'

const ListTask = ({ listTaskDetail, ListProjectDetail }) => {
  const [openModal, setOpenModal] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const queryClient = useQueryClient()

  const [openMenu, setOpenMenu] = useState(null)
  const [selectedPopover, setSelectedPopover] = useState(null)

  const handleOpenModal = (taskId) => {
    return () => {
      setTaskId(taskId)
      setOpenModal(true)
    }
  }

  const handleCloseModal = () => setOpenModal(false)

  const handleOpenMenu = (event, type) => {
    setOpenMenu(event.currentTarget)
    setSelectedPopover(type)
  }

  const handleCloseMenu = (type) => {
    setOpenMenu(false)
    setSelectedPopover(type)
  }

  const { mutate: removeTask } = useMutation({
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
      {listTaskDetail?.map((task) => (
        <Card key={task.taskId}>
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
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    color: '#red',
                  },
                }}
                onClick={handleOpenModal(task.taskId)}
                className={'truncate'}
              >
                {task.taskName}
              </Typography>
            }
            action={
              <IconButton
                onClick={() => {
                  handleRemoveTask(task.taskId)
                }}
              >
                <Iconify icon="eva:trash-2-outline" />
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
                <AvatarGroup max={2} sx={{ cursor: 'pointer' }}>
                  {task.assigness?.map((assign) => (
                    <Avatar
                      key={assign.id}
                      src={assign.avatar}
                      alt={assign.name}
                      sx={{ width: 35, height: 35 }}
                    />
                  ))}
                </AvatarGroup>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      {/* Xử lý modal */}
      <ModalView open={openModal} handleClose={handleCloseModal}>
        <EditTask handleCloseModal={handleCloseModal} taskId={taskId} />
      </ModalView>

      <PopOver
        openMenu={openMenu}
        selectedPopover={selectedPopover}
        handleCloseMenu={handleCloseMenu}
      >
        {/* Xử lý assignUserTask và removeUserTask */}
        {selectedPopover === 'assignUserTask' ? (
          <AssignUserTask handleCloseMenu={handleCloseMenu} />
        ) : (
          <RemoveUserTask handleCloseMenu={handleCloseMenu} />
        )}
      </PopOver>
    </>
  )
}

export default ListTask
