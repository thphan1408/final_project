import { useState } from 'react'
import PropTypes from 'prop-types'

import Label from '../../components/label'
import Iconify from '../../components/iconify'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import ModalView from '../../components/modal/modal'
import PopOver from '../../components/popover/PopOver'

export default function ProjectTableRow({
  selected,
  id,
  projectName,
  categoryName,
  creator,
  members,
  handleClick,
}) {
  const queryClient = useQueryClient()

  // start modal
  const [selectedModal, setSelectedModal] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = (modalType) => {
    setOpenModal(true)
    setSelectedModal(modalType)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedModal(null)
  }
  // end modal

  // start popover
  const [selectedPopover, setSelectedPopover] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const handleOpenMenu = (event, type) => {
    setOpenMenu(event.currentTarget)
    setSelectedPopover(type)
  }

  const handleCloseMenu = (type) => {
    setOpenMenu(false)
    setSelectedPopover(type)
  }
  // end popover

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{projectName}</TableCell>

        <TableCell>{categoryName}</TableCell>

        <TableCell>
          <Label color={'info'}>{creator.name}</Label>
        </TableCell>

        <TableCell>
          <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <AvatarGroup
              max={2}
              onClick={(event) => {
                handleOpenMenu(event, 'avatar')
              }}
              sx={{ cursor: 'pointer' }}
            >
              {members.map((member) => (
                <Avatar
                  key={member.userId}
                  src={member.avatar}
                  alt={member.name}
                />
              ))}
            </AvatarGroup>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                ml: 1,
                p: 0,
                minWidth: 40,
                minHeight: 40,
                borderRadius: '50%',
                textAlign: 'center',
              }}
            >
              <Iconify icon="eva:plus-fill" />
            </Button>
          </Box>
        </TableCell>

        <TableCell align="right">
          <IconButton
            onClick={(event) => {
              handleOpenMenu(event, 'action')
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <PopOver
        openMenu={openMenu}
        handleCloseMenu={handleCloseMenu}
        selectedPopover={selectedPopover}
      >
        {selectedPopover === 'avatar' ? (
          <>
            {members.map((member) => (
              <Stack direction={'column'} sx={{ p: 1 }} key={member.userId}>
                <Box
                  component={'div'}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Stack direction={'row'} alignItems={'center'}>
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ mr: 1, width: 32, height: 32 }}
                    />
                    {member.name}
                  </Stack>
                  <IconButton>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Box>
              </Stack>
            ))}
          </>
        ) : (
          <>
            <Stack direction={'column'} alignItems={'center'}>
              <Button fullWidth>
                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                Sửa
              </Button>
              <Button sx={{ color: 'error.main' }} fullWidth>
                <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                Xóa
              </Button>
            </Stack>
          </>
        )}
      </PopOver>

      {/* <ModalView open={openModal} handleClose={handleCloseModal}>
      </ModalView> */}
    </>
  )
}

ProjectTableRow.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  id: PropTypes.any,
  projectName: PropTypes.any,
  categoryName: PropTypes.any,
  creator: PropTypes.any,
  members: PropTypes.any,
}
