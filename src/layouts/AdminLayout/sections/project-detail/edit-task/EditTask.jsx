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
  IconButton,
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
import SendIcon from '@mui/icons-material/Send'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Controller, get, useForm } from 'react-hook-form'
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
import { useAuth } from '../../../../../context/UserContext/UserContext'
import {
  deleteCommentAPI,
  getAllCommentAPI,
  insertCommentAPI,
  updateCommentAPI,
} from '../../../../../apis/commentAPI'
import PopOver from '../../../components/popover/PopOver'
import Iconify from '../../../components/iconify'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

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
  const { currentUser } = useAuth()
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
  const { data: getAllComment } = useQuery({
    queryKey: ['get-all-comment', taskId],
    queryFn: () => getAllCommentAPI(taskId),
    enabled: !!taskId,
  })

  // useEffect(
  //   () => console.log('getAllComment: ', getAllComment),
  //   [getAllComment]
  // )
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [quillValues, setQuillValues] = useState('')
  const [timeTrackingRemaining, setTimeTrackingRemaining] = useState(0)
  const [projectName, setProjectName] = useState('')

  //select box
  const [selectedUsers, setSelectedUsers] = useState([])
  const [timeTrackingSpent, setTimeTrackingSpent] = useState(
    taskDetail?.timeTrackingSpent || 0
  )
  const [selectedPopover, setSelectedPopover] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [enableComment, setEnableComment] = useState(false)
  const [commentSelect, setCommentSelect] = useState(null)

  const handleOpenMenu = (event, type) => {
    setOpenMenu(event.currentTarget)
    setSelectedPopover(type)
  }

  const handleCloseMenu = (type) => {
    setOpenMenu(null)
    // setSelectedPopover(type)
  }

  const queryClient = useQueryClient()
  const schemaComment = yup.object({
    comment: yup.string().required('Please enter comment'),
  })
  const {
    handleSubmit,
    register,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listUserAsign: taskDetail?.assigness || [],
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
      contentComment: '',
    },
    resolver: yupResolver(schemaComment),
  })

  //TESTING
  /**
   * async bug. please try:
   * catch the state  of selected users first from asgined user => use effect : if ( assignUser)=>setSelectedUsers(assignUser), map and set name state
   * then create a state of selected users name and use this state for selecting box
   * docs: https://github.com/mui/material-ui/blob/v5.15.5/docs/data/material/components/selects/MultipleSelectCheckmarks.tsx
   */

  const checkSelected = (name) => {
    if (selectedUsers) {
      return selectedUsers?.map((item) => item.id).indexOf(name) !== -1
    }
  }

  const handleTimeTrackingSpentChange = (newValue) => {
    setTimeTrackingSpent(newValue)

    // Tính toán timeTrackingRemaining
    const remaining = getValues('originalEstimate') - newValue
    setTimeTrackingRemaining(remaining >= 0 ? remaining : 0)

    // Cập nhật giá trị cho input
    setValue('timeTrackingSpent', newValue)
    setValue('timeTrackingRemaining', remaining >= 0 ? remaining : 0)
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

  const handleChange = (event) => {
    const selectedUserIds = event.target.value
    setSelectedUsers(selectedUserIds)

    // Cập nhật giá trị cho `listUserAsign`
    setValue('listUserAsign', selectedUserIds)
  }

  // set value cho slider
  useEffect(() => {
    setTimeTrackingSpent(taskDetail?.timeTrackingSpent || 0)
  }, [taskDetail?.timeTrackingSpent])

  useEffect(() => {
    // Update state when modal opens
    setProjectName(getAllProjectDetail?.projectName || '')
  }, [getAllProjectDetail])

  useEffect(() => {
    const findUserOnTask = taskDetail?.assigness?.findIndex(
      (user) => user.id === currentUser?.id
    )
    if (findUserOnTask !== -1) {
      setEnableComment(false)
    }
  }, [taskId, currentUser])

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
    handleClose()
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this task?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTask(values)
      }
      return
    })
  }

  const { mutate: insertComment } = useMutation({
    mutationFn: async (payload) => await insertCommentAPI(payload),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries('get-all-comment')
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Comment thất bại',
        text: error.response.data.content || 'Có lỗi xảy ra khi thêm comment.',
        confirmButtonText: 'Đồng ý',
      })
    },
  })
  const { mutate: updateComment } = useMutation({
    mutationFn: async (payload) => await updateCommentAPI(payload),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries('get-all-comment')
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật comment thất bại',
        text:
          error.response.data.content || 'Có lỗi xảy ra khi cập nhật comment.',
        confirmButtonText: 'Đồng ý',
      })
    },
  })

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (payload) => await deleteCommentAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries('get-all-comment')
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Comment thất bại',
        text: error.response.data.content || 'Có lỗi xảy ra khi thêm comment.',
        confirmButtonText: 'Đồng ý',
      })
    },
  })

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
      {!enableComment && (
        <Box sx={{ my: 2 }}>
          <Stack spacing={2} direction={'column'}>
            <Typography variant="h5">Comment</Typography>
            <Box>
              {getAllComment?.map((item) => (
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={1}
                >
                  <Grid item md={2}>
                    <Avatar src={item?.user?.avatar} />
                  </Grid>
                  <Grid item md={9} direction="column">
                    <Typography fontSize={16} fontWeight={700}>
                      {item?.user.name}
                    </Typography>
                    {item?.contentComment}
                  </Grid>

                  {item?.user?.userId === currentUser?.id && (
                    <Grid item md={1}>
                      <IconButton
                        type="submit"
                        onClick={(event) => {
                          handleOpenMenu(event, 'action')
                          // setCommentSelect(item)
                        }}
                      >
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </Grid>
                  )}
                  <PopOver
                    openMenu={openMenu}
                    handleCloseMenu={handleCloseMenu}
                    selectedPopover={selectedPopover}
                  >
                    {selectedPopover === 'action' ? (
                      <Stack
                        direction={'column'}
                        alignItems={'start'}
                        sx={{ width: '110px', p: 1 }}
                        spacing={0.3}
                      >
                        <LoadingButton
                          type="button"
                          fullWidth
                          onClick={() => {
                            handleCloseMenu()
                            setValue(
                              'contentComment',
                              commentSelect.contentComment
                            )
                          }}
                          size="small"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                          }}
                        >
                          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                          Edit
                        </LoadingButton>
                        <LoadingButton
                          sx={{
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                          }}
                          fullWidth
                          size="small"
                          loading={isPending}
                          onClick={() => {
                            handleCloseMenu()
                            deleteComment(commentSelect?.id)
                          }}
                        >
                          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                          Delete
                        </LoadingButton>
                      </Stack>
                    ) : (
                      'abdh'
                    )}
                  </PopOver>
                </Grid>
              ))}
            </Box>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              paddingY={1}
            >
              <Grid item hidden={isMobile} md={2}>
                <Avatar src={currentUser.avatar} />
              </Grid>
              <Grid item md={9}>
                <form action="">
                  <TextField
                    disabled={enableComment}
                    fullWidth
                    placeholder="Add a comment"
                    type="text"
                    {...register('contentComment')}
                    error={Boolean(errors.comment)}
                    helperText={
                      Boolean(errors.comment) && errors.comment.message
                    }
                  />
                </form>
              </Grid>
              <Grid item md={1} textAlign="center">
                <SendIcon
                  onClick={() => {
                    const contentComment = getValues('contentComment')
                    let payload = { contentComment }
                    if (commentSelect) {
                      payload = { ...payload, id: commentSelect?.id }
                      updateComment(payload)
                    } else {
                      payload = { ...payload, taskId }
                      insertComment(payload)
                    }
                    setCommentSelect(null)
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      )}

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
                    value={selectedUsers}
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
