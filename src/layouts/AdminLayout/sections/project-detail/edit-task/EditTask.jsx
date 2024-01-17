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
import {
  createTaskAPI,
  getTaskDetailAPI,
  updateTaskAPI,
} from '../../../../../apis/taskAPI'
import Swal from 'sweetalert2'
import Label from '../../../components/label'

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

const EditTask = ({ handleClose, taskId }) => {
  const { id: projectId } = useParams()

  const { data: getAllProjectDetail } = useQuery({
    queryKey: ['get-all-project-for-task', projectId],
    queryFn: () => getProjectDetailAPI(projectId),
    enabled: !!projectId,
  })

  const { data: taskDetail } = useQuery({
    queryKey: ['get-task-detail', taskId],
    queryFn: () => getTaskDetailAPI(taskId),
    enabled: !!taskId,
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

  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [quillValues, setQuillValues] = useState('')
  const [timeTrackingRemaining, setTimeTrackingRemaining] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [timeTrackingSpent, setTimeTrackingSpent] = useState(
    taskDetail?.timeTrackingSpent || 0
  )

  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    control,
    getValues,
    setValue,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      listUserAsign: taskDetail?.assigness,
      taskId: taskDetail?.taskId,
      taskName: taskDetail?.taskName,
      description: taskDetail?.description,
      statusId: taskDetail?.statusId,
      originalEstimate: taskDetail?.originalEstimate,
      timeTrackingSpent: taskDetail?.timeTrackingSpent,
      timeTrackingRemaining: taskDetail?.timeTrackingRemaining,
      projectId: taskDetail?.projectId,
      typeId: taskDetail?.taskTypeDetail.typeId,
      priorityId: taskDetail?.priorityTask.priorityId,
    },
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
    // setValue('listUserAsign', selectedUserIds)
  }

  useEffect(() => {
    setValue('listUserAsign', taskDetail?.assigness || []),
      setValue('taskName', taskDetail?.taskName || ' '),
      setValue('description', taskDetail?.description),
      setQuillValues(taskDetail?.description),
      setValue('statusId', taskDetail?.statusId),
      setValue('originalEstimate', taskDetail?.originalEstimate || 0),
      setValue('timeTrackingSpent', taskDetail?.timeTrackingSpent || 0),
      setValue('timeTrackingRemaining', taskDetail?.timeTrackingRemaining || 0),
      setValue('projectId', taskDetail?.projectId),
      setValue('typeId', taskDetail?.typeId),
      setValue('taskId', taskDetail?.taskId),
      setValue('priorityId', taskDetail?.priorityId)
  }, [taskId, projectId, taskDetail])

  // set value cho slider
  useEffect(() => {
    setTimeTrackingSpent(taskDetail?.timeTrackingSpent || 0)
  }, [taskDetail?.timeTrackingSpent])

  useEffect(() => {
    // Update state when modal opens
    setProjectName(getAllProjectDetail?.projectName || '')
  }, [getAllProjectDetail])

  const { mutate: updateTask, isPending } = useMutation({
    mutationFn: (values) => {
      return updateTaskAPI(values)
    },
    onSuccess: () => {
      handleClose()
      Swal.fire({
        icon: 'success',
        title: 'Update task successfully',
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
    console.log('values:', values)
    // handleClose()
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to create this task?',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     updateTask(values)
    //   }
    //   return
    // })
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">
          {taskDetail?.taskName} -{' '}
          <Label color={'info'} sx={{ fontSize: '1.5rem' }}>
            {projectName}
          </Label>
        </Typography>
      </Stack>

      <Box sx={{ my: 2 }}>
        <Stack spacing={2} direction={'column'}>
          Comment nằm ở đây
        </Stack>
      </Box>
      <Box>
        <Accordion TransitionProps={{ unmountOnExit: true }} defaultExpanded>
          <AccordionSummary
            sx={{
              background: '#e8e7ec',
              borderRadius: '5px',
            }}
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Task details
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1, margin: 0 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                sx={{ marginTop: 2 }}
                label="Task name"
                fullWidth
                {...register('taskName')}
              />

              <Stack spacing={2} sx={{ my: 2 }} direction={'row'}>
                <TextField
                  label="Original estimate"
                  fullWidth
                  type="number"
                  {...register('originalEstimate')}
                />
                <Controller
                  name="statusId"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControl sx={{ width: '100%' }}>
                        <Select
                          {...field}
                          id="status"
                          fullWidth
                          value={field.value || 1}
                        >
                          {getStatus?.map((item) => {
                            return (
                              <MenuItem
                                key={item.statusId}
                                value={item.statusId}
                              >
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
              </Stack>

              <Stack spacing={2} direction={'row'} alignItems={'center'}>
                <FormControl sx={{ width: '50%' }}>
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
                    {getAllProjectDetail?.members?.map((user) => (
                      <MenuItem key={user.userId} value={user.userId}>
                        <Checkbox
                          checked={selectedUsers.includes(user.userId)}
                        />
                        {/* <Avatar src={user.avatar} sx={{ mr: 2 }} /> */}
                        <ListItemText primary={user.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <AvatarGroup max={3} sx={{ mt: 2 }}>
                  {getAllProjectDetail?.members
                    ?.filter((user) => selectedUsers.includes(user.userId))
                    ?.map((user) => (
                      <Avatar
                        key={user.userId}
                        alt={user.name}
                        src={user.avatar}
                      />
                    ))}
                </AvatarGroup>
              </Stack>

              <Stack spacing={2} direction={'row'} sx={{ my: 2 }}>
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
                          value={field.value || 1}
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
                          value={field.value || 1}
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
              <Stack direction={isMobile ? 'column' : 'row'} sx={{ mt: 2 }}>
                <Grid
                  container
                  spacing={2}
                  direction={isMobile ? 'column' : 'row'}
                >
                  <Grid item sm={12} lg={6}>
                    <Stack direction="column">
                      <InputLabel id="time-tracking">Time tracking</InputLabel>
                      <Slider
                        aria-label="Time tracking"
                        value={timeTrackingSpent}
                        sx={{ ml: 1.5, width: 'calc(100% - 12px)' }}
                        onChange={(event, newValue) => {
                          setTimeTrackingSpent(newValue)
                          handleTimeTrackingSpentChange(newValue)
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item sm={12} lg={6}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
                            <InputAdornment position="end">h</InputAdornment>
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
                            <InputAdornment position="end">h</InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel id="description" sx={{ mb: 1 }}>
                      Description
                    </InputLabel>
                    <ReactQuill
                      id="description"
                      {...field}
                      style={{ width: '100%' }}
                      theme="snow"
                      className="quill-editor-container"
                      placeholder="Write something awesome description..."
                      value={quillValues}
                      onChange={(value) => {
                        setQuillValues(value)
                        field.onChange(value)
                      }}
                    />
                  </>
                )}
              />

              <Stack
                sx={{ mt: 2 }}
                justifyContent={'flex-end'}
                alignItems={'center'}
                direction={'row'}
                spacing={2}
              >
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  loading={isPending}
                  size="large"
                  type="submit"
                >
                  Update task
                </LoadingButton>
              </Stack>
            </form>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}

export default EditTask
