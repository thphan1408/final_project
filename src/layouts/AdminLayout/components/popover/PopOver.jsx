import { Popover } from '@mui/material'
import React from 'react'

const PopOver = (props) => {
  const { openMenu, handleCloseMenu, children, selectedPopover } = props

  return (
    <Popover
      open={!!openMenu}
      anchorEl={openMenu}
      onClose={
        handleCloseMenu || selectedPopover
          ? () => handleCloseMenu(selectedPopover)
          : null
      }
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 'auto' },
      }}
    >
      {children}
    </Popover>
  )
}

export default PopOver
