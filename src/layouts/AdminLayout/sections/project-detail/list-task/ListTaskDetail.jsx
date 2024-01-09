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

const ListTask = ({ taskDetail }) => {
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedPopover, setSelectedPopover] = useState(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

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
            onClick={handleOpen}
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
                  fontSize: '1.1rem',
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
                sx={{ fontSize: '1.2rem' }}
              >
                {task.priorityTask.priority}
              </Label>
              <Stack direction={'row'}>
                <AvatarGroup max={1} sx={{ cursor: 'pointer' }}>
                  {task.assigness?.map((assign) => (
                    <Avatar
                      key={assign.id}
                      src={assign.avatar}
                      alt={assign.name}
                      sx={{ mr: 1 }}
                    />
                  ))}
                </AvatarGroup>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    p: 0,
                    minWidth: 40,
                    minHeight: 40,
                    borderRadius: '50%',
                    textAlign: 'center',
                  }}
                  onClick={(event) => {
                    handleOpenMenu(event, 'assignUserTask')
                  }}
                >
                  <Iconify icon="eva:plus-fill" />
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <PopOver open={openMenu} handleCloseMenu={handleCloseMenu}>
        {/* Xử lý assignUserTask và removeUserTask */}
      </PopOver>

      {/* Xử lý modal */}
      <ModalView open={open} handleClose={handleClose}>
        <Box>
          <Typography variant="h4">Task detail</Typography>
        </Box>
      </ModalView>
    </>
  )
}

export default ListTask
