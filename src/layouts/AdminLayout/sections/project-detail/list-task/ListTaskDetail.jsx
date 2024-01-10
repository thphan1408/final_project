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

const ListTask = ({ taskDetail }) => {
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedPopover, setSelectedPopover] = useState(null)
  const [openModal, setOpenModal] = useState(false)

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
      {taskDetail?.map((task) => (
        <Card
          key={task.taskId}
          sx={{
            backgroundColor: '#f0f0f0',
            mb: 2,
          }}
        >
          <CardHeader
            onClick={handleOpenModal}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              p: '0.5rem 1rem',
              '&:hover': {
                backgroundColor: '#ccc',
              },
            }}
            title={
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: '#212B36',
                  fontWeight: 'bold',
                }}
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
                <AvatarGroup
                  max={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={(event) => {
                    handleOpenMenu(event, 'removeUserTask')
                  }}
                >
                  {task.assigness?.map((assign) => (
                    <Avatar
                      key={assign.id}
                      src={assign.avatar}
                      alt={assign.name}
                      sx={{ width: 25, height: 25 }}
                    />
                  ))}
                </AvatarGroup>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    p: 0,
                    minWidth: 25,
                    minHeight: 25,
                    borderRadius: '50%',
                    textAlign: 'center',
                    fontSize: '1rem',
                    ml: 1,
                  }}
                  onClick={(event) => {
                    handleOpenMenu(event, 'assignUserTask')
                  }}
                >
                  <Iconify icon="eva:plus-fill" sx={{ width: 15, p: 0 }} />
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <PopOver
        openMenu={openMenu}
        selectedPopover={selectedPopover}
        handleCloseMenu={handleCloseMenu}
      >
        {/* Xử lý assignUserTask và removeUserTask */}
        {selectedPopover === 'assignUserTask' ? (
          <AssignUserTask
            taskId={taskDetail.taskId}
            members={taskDetail.assigness}
            handleCloseMenu={handleCloseMenu}
          />
        ) : selectedPopover === 'removeUserTask' ? (
          <RemoveUserTask
            taskId={taskDetail.taskId}
            members={taskDetail.assigness}
            handleCloseMenu={handleCloseMenu}
          />
        ) : (
          ''
        )}
      </PopOver>

      {/* Xử lý modal */}
      <ModalView open={openModal} handleClose={handleCloseModal}>
        <Typography variant="h4">Task detail</Typography>
        <TaskDetail
          handleCloseModal={handleCloseModal}
          handleCloseMenu={handleCloseMenu}
        />
      </ModalView>
    </>
  )
}

export default ListTask
