import Typography from '@mui/material/Typography'
import { PATH } from '../../../../../constants/path'
// import { useAuth } from '../../../../../contexts/UserContext/UserContext'
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  alpha,
  Link,
} from '@mui/material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../../../context/UserContext/UserContext'

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { currentUser, handleLogout } = useAuth()
  const navigate = useNavigate()
  // if (currentUser) {
  //   return <Navigate to={PATH.ROOT} />
  // }

  const [open, setOpen] = useState(null)

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={currentUser.avatar}
          alt={currentUser.name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {currentUser.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Link href="/profile" variant="subtitle2" noWrap underline="none">
            {currentUser.name}
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {currentUser.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Button
          fullWidth
          onClick={() => {
            navigate(PATH.PROFILE)
            handleClose()
          }}
          sx={{ typography: 'body2', py: 0.75, px: 2.5, borderRadius: 0 }}
        >
          Profile
        </Button>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <Button
          fullWidth
          onClick={handleLogout}
          sx={{
            typography: 'body2',
            color: 'error.main',
            py: 1.5,
            borderRadius: 0,
          }}
        >
          Logout
        </Button>
      </Popover>
    </>
  )
}
