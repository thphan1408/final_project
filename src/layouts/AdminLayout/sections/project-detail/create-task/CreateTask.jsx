import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { getAllStatusAPI } from '../../../../../apis/statusAPI'
import '../../css/quill.css'
import 'react-quill/dist/quill.snow.css'
import { getAllPriorityAPI } from '../../../../../apis/priorityAPI'
import { getAllTaskTypeAPI } from '../../../../../apis/typeAPI'

const CreateTask = ({ handleClose }) => {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const queryClient = useQueryClient()
  const [quillValues, setQuillValues] = useState('')

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

  const {
    handleSubmit,
    register,
    control,
    getValues,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      listUserAsign: [],
      taskName: '',
      description: '',
      statusId: '',
      originalEstimate: 0 || null,
      timeTrackingSpent: 0 || null,
      timeTrackingRemaining: 0 || null,
      projectId: 0 || null,
      typeId: 0 || null,
      priorityId: 0 || null,
    },
    // mode: 'all',
    // resolver: yupResolver(schemaAddProject),
  })

  const onSubmit = (values) => {
    // handleCreateTask(values)
  }
  return (
    <Box>
      <Grid
        justifyContent={isMobile ? 'flex-start' : 'center'}
        alignItems={'flex-start'}
      >
        <Grid item md={isMobile ? 12 : isTablet ? 8 : 6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                height: isMobile || isTablet ? '500px' : 'auto',
                overflowY: isMobile || isTablet ? 'scroll' : 'visible',
                '&::-webkit-scrollbar': {
                  width: '0.4em',
                },
              }}
            >
              <Stack
                spacing={2}
                direction={isMobile ? 'column' : 'row'}
                sx={{ my: 2 }}
              >
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
                />
              </Stack>
              <Stack
                spacing={2}
                direction={isMobile ? 'column' : 'row'}
                sx={{ mb: 2 }}
              >
                <Controller
                  name="statusId"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel
                          // sx={{
                          //   color: errors.categoryId ? 'error.main' : undefined,
                          //   '&.Mui-focused': {
                          //     color: errors.categoryId ? 'error.main' : undefined,
                          //   },
                          // }}
                          id="status"
                        >
                          Status type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="status"
                          id="status"
                          fullWidth
                          label="Status type"
                          defaultValue={getValues('statusId')}
                          // error={!!errors.categoryId}
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
                          defaultValue={getValues('priorityId')}
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
                          defaultValue={getValues('typeId')}
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
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    theme="snow"
                    className="quill-editor-container"
                    placeholder="Write something awesome description..."
                    value={quillValues}
                    onChange={(value) => {
                      setQuillValues(value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
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
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CreateTask
