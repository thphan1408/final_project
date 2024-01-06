import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useMediaQuery } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxHeight: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: '10px',
  p: 4,
}

const ModalView = (props) => {
  const { open, handleClose, children } = props
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')

  const modalStyle = {
    ...style,
    width: isMobile ? '90%' : '60%',
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>{children}</Box>
    </Modal>
  )
}

export default ModalView
