import {
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
} from '@mui/material'
import React, { useState } from 'react'
import Iconify from '../../../components/iconify'
import ModalView from '../../../components/modal/modal'
import { useParams } from 'react-router-dom'
import ProjectDetailToolbar from '../project-detail-toolbar'
import { applyFilter, getComparator } from '../utils'
import Label from '../../../components/label'
import { useQuery } from '@tanstack/react-query'
import { getProjectDetailAPI } from '../../../../../apis/projectAPI'
import ListTaskDetail from '../list-task'
import CreateTask from '../create-task'

const ProjectDetail = () => {
  const { id } = useParams()

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

  console.log('🚀  ListProjectDetail:', ListProjectDetail)

  const listTask = ListProjectDetail?.lstTask
  // const dataAllProject = applyFilter({
  //   inputData: 'ListProject',
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // })

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Project Detail - {id}</Typography>
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
              <Grid item xs={3} key={listTask.statusId}>
                <Card
                  sx={{
                    backgroundColor: '#dedee2',
                  }}
                >
                  {/* <Box sx={{ p: 1, borderBottom: '1px solid #fff' }}>
                    
                  </Box> */}
                  <CardHeader
                    title={
                      <Typography
                        sx={{
                          fontSize: '1.1rem',
                          color: '#212B36',
                          fontWeight: 'bold',
                        }}
                      >
                        {listTask.statusName}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <ListTaskDetail taskDetail={listTask.lstTaskDeTail} />
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>

      <ModalView open={open} handleClose={handleClose}>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">Create task for project -</Typography>
          <Label
            color="error"
            sx={{ fontSize: '1.5rem', ml: 1, fontWeight: '700' }}
          >
            {id}
          </Label>
        </Box>

        <CreateTask handleClose={handleClose} />
      </ModalView>
    </>
  )
}

export default ProjectDetail
