import { LoadingButton } from '@mui/lab'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { getAllStatusAPI } from '../../../../../apis/statusAPI'
import '../../css/quill.css'
import 'react-quill/dist/quill.snow.css'
import { getAllPriorityAPI } from '../../../../../apis/priorityAPI'
import { getAllTaskTypeAPI } from '../../../../../apis/typeAPI'
import { getProjectDetailAPI } from '../../../../../apis/projectAPI'
import { useParams } from 'react-router-dom'
import { createTaskAPI } from '../../../../../apis/taskAPI'
import Swal from 'sweetalert2'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const CreateTask = ({ handleClose }) => {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [quillValues, setQuillValues] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [timeTrackingSpent, setTimeTrackingSpent] = useState(0)
  const [timeTrackingRemaining, setTimeTrackingRemaining] = useState(0)
  const [projectName, setProjectName] = useState('')

  const queryClient = useQueryClient()

  const { id: projectId } = useParams()

  const { data: getAllProjectDetail } = useQuery({
    queryKey: ['get-all-project-for-task', projectId],
    queryFn: () => getProjectDetailAPI(projectId),
    enabled: !!projectId,
  })

  const { data: getStatus } = useQuery({
    queryKey: ['get-all-status'],
    queryFn: getAllStatusAPI,
  })
  const { data: getPriority } = useQuery({
    queryKey: ['get-all-priority'],
    queryFn: getAllPriorityAPI,
  })
  const { data: getTaskType } = useQuery({
    queryKey: ['get-all-task-type'],
    queryFn: getAllTaskTypeAPI,
  })

  useEffect(() => {
    // Update state when modal opens
    setProjectName(getAllProjectDetail?.projectName || '')
  }, [getAllProjectDetail])

  const {
    handleSubmit,
    register,
    control,
    getValues,
    setValue,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      listUserAsign: [],
      taskName: '',
      description: '',
      statusId: '1',
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: parseInt(projectId),
      typeId: 1,
      priorityId: 1,
    },
    // mode: 'all',
    // resolver: yupResolver(schemaAddProject),
  })

  const handleTimeTrackingSpentChange = (newValue) => {
    setTimeTrackingSpent(newValue)

    // Tính toán timeTrackingRemaining
    const remaining = getValues('originalEstimate') - newValue
    setTimeTrackingRemaining(remaining >= 0 ? remaining : 0)

    // Cập nhật giá trị cho input
    setValue('timeTrackingSpent', newValue)
    setValue('timeTrackingRemaining', remaining >= 0 ? remaining : 0)
  }

  const handleChange = (event) => {
    const selectedUserIds = event.target.value
    setSelectedUsers(selectedUserIds)

    // Cập nhật giá trị cho `listUserAsign`
    setValue('listUserAsign', selectedUserIds)
  }

  const { mutate: createTask } = useMutation({
    mutationFn: (values) => {
      return createTaskAPI(values)
    },
    onSuccess: () => {
      handleClose()
      Swal.fire({
        icon: 'success',
        title: 'Success create new task',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries(['get-all-project-for-task'])
        }
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: error.content,
        confirmButtonText: 'Ok',
        showDenyButton: true,
        denyButtonText: 'Cancel',
      })
    },
  })

  const onSubmit = (values) => {
    console.log('values: ', values)
    // console.log('🚀  values:', values)
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this task?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        createTask(values)
      }
      return
    })
    handleClose()
  }

  return (
    <Box
      sx={{
        height: isMobile || isTablet ? '500px' : '600px',
        overflow: 'scroll', // Set to 'auto' to enable scrolling
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
      }}
    >
      <Typography variant="h4">{getAllProjectDetail?.projectName}</Typography>
      <Grid
        justifyContent={isMobile ? 'flex-start' : 'center'}
        alignItems={'flex-start'}
      >
        <Grid item md={isMobile ? 12 : isTablet && 8}>
          <Box>
            <Stack
              spacing={2}
              direction={isMobile ? 'column' : 'row'}
              sx={{ my: 2 }}
            >
              <TextField
                sx={{ background: '#e8e7ec' }}
                label="Description"
                fullWidth
                {...register('description')}
              />
            </Stack>

            <Controller
              name="statusId"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl
                    sx={{
                      minWidth: '20%',
                      marginBottom: '1rem',
                      background: '#e8e7ec',
                    }}
                  >
                    <Select
                      {...field}
                      id="status"
                      fullWidth
                      value={field.value || 1}
                    >
                      {getStatus?.map((item) => {
                        return (
                          <MenuItem key={item.statusId} value={item.statusId}>
                            {item.statusName}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {/* {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )} */}
                  </FormControl>
                )
              }}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Accordion
                defaultExpanded
                sx={{
                  '&.MuiAccordion-root.Mui-expanded': {
                    margin: '0',
                    padding: 0,
                  },
                  '& .MuiAccordionSummary-root': {
                    minHeight: '10px',
                    margin: 0,
                  },
                  '& .MuiAccordionDetails-root': {},
                }}
              >
                <AccordionSummary
                  sx={{ border: 0 }}
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>Details</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0, margin: 0, border: 0 }}>
                  <Box
                    item
                    xs={12}
                    md={6}
                    my="1rem"
                    sx={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <FormControl
                      sx={{
                        width: '50%',
                        pr: 2,
                      }}
                    >
                      <InputLabel id="assignUserTask">Assigness</InputLabel>
                      <Select
                        labelId="assignUserTask"
                        id="assignUserTask"
                        fullWidth
                        multiple
                        value={selectedUsers || []}
                        onChange={handleChange}
                        input={<OutlinedInput label="Assigness" />}
                        renderValue={(selected) => {
                          const selectedUserNames = getAllProjectDetail?.members
                            ?.filter((user) => selected.includes(user.userId))
                            ?.map((user) => user.name)
                          return selectedUserNames.join(', ')
                        }}
                        MenuProps={MenuProps}
                      >
                        {getAllProjectDetail?.members?.map((user, index) => (
                          <MenuItem key={index} value={user.userId}>
                            <Checkbox
                              checked={selectedUsers.includes(user.userId)}
                            />
                            {/* <Avatar src={user.avatar} sx={{ mr: 2 }} /> */}
                            <ListItemText primary={user.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <AvatarGroup
                      max={2}
                      sx={{
                        flexDirection: 'row',
                        justifyContent: 'start',
                        cursor: 'pointer',
                        marginTop: '.5em',
                      }}
                    >
                      {getAllProjectDetail?.members?.map((assign, index) => (
                        <Avatar
                          key={index}
                          src={assign.avatar}
                          alt={assign.name}
                          sx={{ width: 35, height: 35 }}
                        />
                      ))}
                    </AvatarGroup>
                  </Box>

                  <TextField
                    label="Task name"
                    fullWidth
                    {...register('taskName')}
                  />
                  <TextField
                    label="Original estimate"
                    fullWidth
                    type="number"
                    {...register('originalEstimate')}
                    sx={{ my: 2 }}
                  />
                  <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
                    <Controller
                      name="priorityId"
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="priority">Priority type</InputLabel>
                            <Select
                              {...field}
                              labelId="priority"
                              id="priority"
                              fullWidth
                              label="Priority type"
                              value={parseInt(field.value) || 1}
                            >
                              {getPriority?.map((item) => {
                                return (
                                  <MenuItem
                                    key={item.priorityId}
                                    value={item.priorityId}
                                  >
                                    {item.priority}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                            {/* {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )} */}
                          </FormControl>
                        )
                      }}
                    />

                    <Controller
                      name="typeId"
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="task">Task type</InputLabel>
                            <Select
                              {...field}
                              labelId="task"
                              id="task"
                              fullWidth
                              label="Task type"
                              value={parseInt(field.value) || 1}
                            >
                              {getTaskType?.map((item) => {
                                return (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.taskType}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                            {/* {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )} */}
                          </FormControl>
                        )
                      }}
                    />
                  </Stack>
                  <Stack direction={isMobile ? 'column' : 'row'} sx={{ my: 2 }}>
                    <Grid
                      container
                      spacing={2}
                      direction={isMobile ? 'column' : 'row'}
                    >
                      <Grid item sm={12} lg={6}>
                        <Stack direction="column">
                          <InputLabel id="time-tracking">
                            Time tracking
                          </InputLabel>
                          <Slider
                            sx={{ ml: 1.5, width: 'calc(100% - 12px)' }}
                            aria-label="Time tracking"
                            value={timeTrackingSpent || 0}
                            onChange={(event, newValue) => {
                              setTimeTrackingSpent(newValue)
                              handleTimeTrackingSpentChange(newValue)
                            }}
                          />
                        </Stack>
                      </Grid>
                      <Grid item sm={12} lg={6}>
                        <Stack direction="row" spacing={2}>
                          <TextField
                            label="Time tracking spent"
                            type="number"
                            fullWidth
                            {...register('timeTrackingSpent')}
                            onChange={(event) =>
                              handleTimeTrackingSpentChange(event.target.value)
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  h
                                </InputAdornment>
                              ),
                            }}
                          />{' '}
                          <TextField
                            label="Time tracking remaining"
                            type="number"
                            fullWidth
                            {...register('timeTrackingRemaining')}
                            onChange={(event) =>
                              setTimeTrackingRemaining(event.target.value)
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  h
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={isMobile ? 2 : 2}
                sx={{ mt: 2 }}
                justifyContent={'flex-start'}
              >
                <LoadingButton
                  variant="contained"
                  size="large"
                  type="submit"
                  fullWidth
                >
                  Create task
                </LoadingButton>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  color="error"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CreateTask
