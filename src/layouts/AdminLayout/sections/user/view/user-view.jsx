import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

import Iconify from '../../../components/iconify'
import Scrollbar from '../../../components/scrollbar'

import TableNoData from '../table-no-data'
import UserTableRow from '../user-table-row'
import UserTableHead from '../user-table-head'
import TableEmptyRows from '../table-empty-rows'
import UserTableToolbar from '../user-table-toolbar'
import { emptyRows, applyFilter, getComparator } from '../utils'
import { QueryClient, useQuery } from '@tanstack/react-query'
import ModalView from '../../../components/modal/modal'
import { getUserListAPI } from '../../../../../apis/userAPI'

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0)

  const [order, setOrder] = useState('asc')

  const [selected, setSelected] = useState([])

  const [orderBy, setOrderBy] = useState('taiKhoan')

  const [filterName, setFilterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc'
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(id)
    }
  }
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.email)
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = async (event) => {
    setPage(0)
    setRowsPerPage(parseInt(event.target.value, 10))
  }

  const { data: userList = [] } = useQuery({
    queryKey: ['get-list-user'],
    queryFn: () => getUserListAPI(),
  })

  const handleFilterByName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }
  const dataUser = applyFilter({
    inputData: userList,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  const notFound = !userList?.length && !!filterName

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Users management</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpen}
        >
          New User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={userList?.length || 0}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                // { id: 'taiKhoan', label: 'Tài khoản' },
                { id: 'email', label: 'Email' },
                { id: 'name', label: 'Name' },
                { id: 'avatar', label: 'Avatar' },
                { id: 'phoneNumber', label: 'Phone number' },
                { id: '', label: ' ' },
              ]}
            />
            <TableBody>
              {dataUser
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <UserTableRow
                    key={user.userId}
                    userId={user.userId}
                    name={user.name}
                    email={user.email}
                    avatar={user.avatar}
                    phoneNumber={user.phoneNumber}
                    selected={selected.indexOf(user.email) !== -1}
                    handleClick={(event) => handleClick(event, user.email)}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          page={page || 0}
          component="div"
          count={dataUser?.length || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <ModalView open={open} handleClose={handleClose}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thêm người dùng
        </Typography>
        {/* <AddUser handleClose={handleClose} /> */}
      </ModalView>
    </Container>
  )
}
