import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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

const ListTask = ({ listTaskDetail }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedPopover, setSelectedPopover] = useState(null)

  const handleOpenModal = () => setOpenModal(true)

  const handleCloseModal = () => setOpenModal(false)

  const handleOpenMenu = (event, type) => {
    setOpenMenu(event.currentTarget)
    setSelectedPopover(type)
  }

  const handleCloseMenu = (type) => {
    setOpenMenu(false)
    setSelectedPopover(type)
  }
  return (
    <>
      {listTaskDetail?.map((task) => (
        <Card
          key={task.taskId}
          onClick={handleOpenModal}
          sx={{
            backgroundColor: '#f0f0f0',
            mb: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
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
        <Typography variant="h4">Task detail</Typography>
        <TaskDetail handleCloseModal={handleCloseModal} />
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
