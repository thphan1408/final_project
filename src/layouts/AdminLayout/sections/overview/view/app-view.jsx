import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../../../../context/UserContext/UserContext'
import Label from '../../../components/label'

// ----------------------------------------------------------------------

export default function AppView() {
  const { currentUser } = useAuth()

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi{' '}
        <Label sx={{ fontSize: '1.25rem' }} color={'info'}>
          {currentUser.name}
        </Label>
        , Welcome back 👋
      </Typography>
    </Container>
  )
}
