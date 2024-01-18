import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { lazy, useState } from 'react'
import Iconify from '../../../components/iconify'
import ModalView from '../../../components/modal/modal'
import { useParams } from 'react-router-dom'
import ProjectDetailToolbar from '../project-detail-toolbar'
import { applyFilter, getComparator } from '../utils'
import Label from '../../../components/label'
import { useQuery } from '@tanstack/react-query'
import { getProjectDetailAPI } from '../../../../../apis/projectAPI'
import ListTaskDetail from '../list-task/ListTaskDetail'
import CreateTask from '../create-task'

const ProjectDetail = () => {
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const [open, setOpen] = useState(false)
  const [orderBy, setOrderBy] = useState('projectName')
  const [selected, setSelected] = useState([])
  const [order, setOrder] = useState('asc')
  const [filterName, setFilterName] = useState('')

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
  }

  const { data: ListProjectDetail } = useQuery({
    queryKey: ['get-list-project-detail-by-id', id],
    queryFn: () => getProjectDetailAPI(id),
    enabled: !!id,
  })

  const listTask = ListProjectDetail?.lstTask

  return (
    <>
      <Container sx={{ mt: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ mr: 3 }}
          >
            <Typography variant="h4" className="truncate">
              {ListProjectDetail?.projectName}
            </Typography>
            <AvatarGroup max={3}>
              {ListProjectDetail?.members?.map((member) => {
                return (
                  <Avatar
                    key={member.userId}
                    src={member.avatar}
                    alt={member.name}
                  />
                )
              })}
            </AvatarGroup>
          </Stack>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpen}
          >
            Create task
          </Button>
        </Stack>
        <Box>
          <ProjectDetailToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
        </Box>

        <Grid container spacing={2}>
          {listTask?.map((listTask, index) => {
            return (
              <Grid
                item
                xs={12}
                md={isMobile || isTablet ? 12 : 3}
                key={Number(listTask.statusId)}
              >
                <Card
                  sx={{
                    backgroundColor: '#dedee2',
                    minHeight: '300px',
                  }}
                >
                  <CardHeader
                    title={
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          color: '#212B36',
                          fontWeight: 'bold',
                        }}
                      >
                        {listTask.statusName}
                      </Typography>
                    }
                  />
                  <CardContent>
                    {listTask?.lstTaskDeTail.map((task) => (
                      <ListTaskDetail key={task.taskId} task={task} />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>

      <ModalView open={open} handleClose={handleClose}>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            flexDirection: isMobile || isTablet ? 'column' : 'row',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Create task for project </Typography>
        </Box>

        <CreateTask handleClose={handleClose} />
      </ModalView>
    </>
  )
}

export default ProjectDetail
