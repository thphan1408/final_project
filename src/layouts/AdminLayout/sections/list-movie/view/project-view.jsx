import { useState } from 'react'
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material'
import React from 'react'
import Scrollbar from '../../../components/scrollbar'
import { useQuery } from '@tanstack/react-query'
import Iconify from '../../../components/iconify'

import ProjectTableHead from '../project-table-head'
import { applyFilter, getComparator, emptyRows } from '../utils'
import ProjectTableRow from '../project-table-row'
import ModalView from '../../../components/modal/modal'
import { getAllProjectAPI } from '../../../../../apis/projectAPI'
import TableEmptyRows from '../table-empty-rows'
import TableNoData from '../table-no-data'
import ProjectTableToolbar from '../project-table-toolbar'

const ProjectView = () => {
  // Start pagination
  const [page, setPage] = useState(null)

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPage(0)
    setRowsPerPage(+event.target.value, 10)
  }
  // End pagination

  const [order, setOrder] = useState('asc')

  const [selected, setSelected] = useState([])

  const [orderBy, setOrderBy] = useState('projectName')

  const [filterName, setFilterName] = useState('')

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const {
    data: ListProject,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['get-list-project'],
    queryFn: getAllProjectAPI,
  })

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc'
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(id)
    }
  }
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ListProject?.map((n) => n.projectName)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleFilterByName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }

  const dataAllProject = applyFilter({
    inputData: ListProject,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  const notFound = !ListProject?.length && !!filterName

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Project management</Typography>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpen}
          >
            New project
          </Button>
        </Stack>

        <Card>
          <ProjectTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          {/* <Scrollbar> */}
          <TableContainer sx={{ overflow: 'scrollbar' }}>
            <Table sx={{ minWidth: 1100 }}>
              <ProjectTableHead
                order={order}
                orderBy={orderBy}
                rowCount={ListProject?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'projectName', label: 'Project name' },
                  { id: 'categoryName', label: 'Category name' },
                  { id: 'creator', label: 'Creator' },
                  { id: 'nember', label: 'Nember' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataAllProject
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((project) => (
                    <ProjectTableRow
                      key={project.id}
                      projectName={project.projectName}
                      categoryName={project.categoryName}
                      creator={project.creator}
                      members={project?.members}
                      selected={selected.indexOf(project.projectName) !== -1}
                      handleClick={(event) =>
                        handleClick(event, project.projectName)
                      }
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* </Scrollbar> */}

          <TablePagination
            page={page || 0}
            component="div"
            count={dataAllProject?.length || 0}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <ModalView open={open} handleClose={handleClose}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add new project
        </Typography>
        {/* <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
        </Scrollbar> */}
        {/* <AddMovie handleClose={handleClose} /> */}
      </ModalView>
    </>
  )
}

export default ProjectView
