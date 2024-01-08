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

const ListTask = ({ taskDetail }) => {
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedPopover, setSelectedPopover] = useState(null)

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
              <Label color={'default'} sx={{ fontSize: '1.2rem' }}>
                {task.priorityTask.priority}
              </Label>
              <Stack direction={'row'}>
                <AvatarGroup max={2} sx={{ cursor: 'pointer' }}>
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

      <PopOver openMenu={openMenu} handleCloseMenu={handleCloseMenu}>
        {/* Xử lý assignUserTask và removeUserTask */}
      </PopOver>
    </>
  )
}

export default ListTask
