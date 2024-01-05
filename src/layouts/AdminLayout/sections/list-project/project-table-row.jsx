import styles from './css/project-table-row.module.css'
import { lazy, useState } from 'react'
import PropTypes from 'prop-types'

import Label from '../../components/label'
import Iconify from '../../components/iconify'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import ModalView from '../../components/modal/modal'
import PopOver from '../../components/popover/PopOver'
import { LoadingButton } from '@mui/lab'
import { deleteProjectAPI } from '../../../../apis/projectAPI'
import UpdateProject from './update-project'
import { useDispatch, useSelector } from 'react-redux'
import { projectsActions } from '../../redux/projects/slice'

const AssignUserProject = lazy(() =>
  import('./search-add-user/AssignUserProject')
)
const RemoveUserProject = lazy(() =>
  import('./remove-user-form-project/RemoveUserProject')
)

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}
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

  // start delete project
  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: (projectId) => deleteProjectAPI(projectId),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Delete project success!',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries('get-list-project')
        }
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: error.content,
        // text: error.message,
        showConfirmButton: 'Ok',
      })
    },
  })

  const handleDeleteProject = (projectId) => {
    handleCloseMenu()
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to delete this project?',
      confirmButtonText: 'OK',
      showDenyButton: true,
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(projectId)
      }
      return
    })
  }

  const dispatch = useDispatch()

  const handleProject = (id) => {
    dispatch(projectsActions.setProject(id))
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>
          <Label color={'primary'}>
            <Link
              to={`/admin/project-detail/${id}`}
              onClick={() => {
                handleProject(id)
              }}
              className={styles.link}
            >
              {projectName}
            </Link>
          </Label>
        </TableCell>

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
              onClick={(event) => {
                handleOpenMenu(event, 'add-member')
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
        {selectedPopover === 'add-member' ? (
          <AssignUserProject
            projectId={id}
            members={members}
            handleCloseMenu={handleCloseMenu}
          />
        ) : selectedPopover === 'avatar' ? (
          <RemoveUserProject
            projectId={id}
            members={members}
            handleCloseMenu={handleCloseMenu}
          />
        ) : (
          <>
            <Stack
              direction={'column'}
              alignItems={'center'}
              sx={{ width: '120px', p: 1 }}
              spacing={0.3}
            >
              <Button fullWidth onClick={handleOpenModal} size="large">
                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                Sửa
              </Button>
              <LoadingButton
                sx={{ color: 'error.main' }}
                fullWidth
                size="large"
                onClick={() => {
                  handleDeleteProject(id)
                }}
              >
                <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                Xóa
              </LoadingButton>
            </Stack>
          </>
        )}
      </PopOver>

      <ModalView open={openModal} handleClose={handleCloseModal}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update project
        </Typography>
        <UpdateProject
          projectId={id}
          handleCloseModal={handleCloseModal}
          handleCloseMenu={handleCloseMenu}
        />
      </ModalView>
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
