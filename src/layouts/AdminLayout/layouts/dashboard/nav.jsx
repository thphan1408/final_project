import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { usePathname } from '../../routes/hooks'
import { RouterLink } from '../../routes/components'

import { useResponsive } from '../../hooks/use-responsive'

import Logo from '../../components/logo'
import Scrollbar from '../../components/scrollbar'

import { NAV } from './config-layout'
import navConfig from './config-navigation'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  ListItemButton,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import { useAuth } from '../../../../context/UserContext/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Label from '../../components/label'

export default function Nav({ openNav, onCloseNav }) {
  const { currentUser } = useAuth()
  const pathname = usePathname()

  const upLg = useResponsive('up', 'lg')

  useEffect(() => {
    if (openNav) {
      onCloseNav()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
        src={currentUser.avatar}
        alt={currentUser.name}
      />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{currentUser.name}</Typography>
      </Box>
    </Box>
  )
  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  )

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  )

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  )
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
}

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname()
  const active = item.path === pathname
  const { id } = useParams()

  // Khởi tạo state để lưu trữ giá trị storedId
  const [newStoredId, setNewStoredId] = useState(null)

  useEffect(() => {
    if (id) {
      localStorage.setItem('projectId', id)
      setNewStoredId(id)
    }
  }, [id])

  // Xóa storedId khi người dùng thoát khỏi trang
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('projectId')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    const storedId = localStorage.getItem('projectId')
    setNewStoredId(storedId) // Cập nhật storedId trong state
  }, [])

  const itemPath =
    item.path === 'project-detail/:id'
      ? `/admin/project-detail/${newStoredId}`
      : `${item.path}`

  return (
    <ListItemButton
      component={RouterLink}
      href={itemPath}
      disabled={item.path === 'project-detail/:id' && !newStoredId}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">
        {item.title === 'Project Detail' ? (
          <>
            {item.title}
            {newStoredId && (
              <Label
                color={'warning'}
                sx={{
                  ml: 1,
                }}
              >
                {newStoredId}
              </Label>
            )}
          </>
        ) : (
          item.title
        )}
      </Box>
    </ListItemButton>
  )
}

NavItem.propTypes = {
  item: PropTypes.object,
}
