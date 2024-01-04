import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useForm, Controller, get } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoadingButton } from '@mui/lab'
import Swal from 'sweetalert2'
import { createProjectAPI } from '../../../../../apis/projectAPI'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getProjectCategoryAPI } from '../../../../../apis/projectCategoryAPI'
import '../css/quill.css'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schemaAddProject = yup.object({
  projectName: yup.string().required('Please enter project name'),
  categoryId: yup.string().required('Please select category'),
  description: yup.string().required('Please enter description'),
})

const AddProject = ({ handleClose }) => {
  const queryClient = useQueryClient()
  const [quillValues, setQuillValues] = useState('')

  const {
    handleSubmit,
    register,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: '',
      projectName: '',
      alias: '',
      description: '',
    },
    mode: 'all',
    resolver: yupResolver(schemaAddProject),
  })

  const { data } = useQuery({
    queryKey: ['get-list-category'],
    queryFn: getProjectCategoryAPI,
  })

  const { mutate: handleCreateProject, isPending } = useMutation({
    mutationFn: (payload) => createProjectAPI(payload),
    onSuccess: () => {
      handleClose()
      Swal.fire({
        icon: 'success',
        title: 'Success create new project',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries('get-list-project')
        }
      })
    },
    onError: (error) => {
      handleClose()

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
        confirmButtonText: 'Ok',
        showDenyButton: true,
        denyButtonText: 'Cancel',
      })
    },
  })

  const onSubmit = (values) => {
    handleCreateProject(values)
  }

  // Responsive
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box>
      <Grid
        justifyContent={isMobile ? 'flex-start' : 'center'}
        alignItems={'flex-start'}
      >
        <Grid item md={isMobile ? 12 : isTablet ? 8 : 6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={2}
              direction={isMobile ? 'column' : 'row'}
              sx={{ mb: 2 }}
            >
              <TextField
                label="Project name"
                fullWidth
                {...register('projectName')}
                error={Boolean(errors.projectName)}
                helperText={
                  Boolean(errors.projectName) && errors.projectName.message
                }
              />

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel
                        sx={{
                          color: errors.categoryId ? 'error.main' : undefined,
                          '&.Mui-focused': {
                            color: errors.categoryId ? 'error.main' : undefined,
                          },
                        }}
                        id="category"
                      >
                        Category
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="category"
                        id="category"
                        fullWidth
                        label="Category"
                        defaultValue={getValues('categoryId')}
                        error={!!errors.categoryId}
                      >
                        {data?.map((item) => {
                          return (
                            <MenuItem key={item.id} value={item.id}>
                              {item.projectCategoryName}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )
                }}
              />
            </Stack>
            <Stack spacing={2}>
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

              {/* <TextField label="Alias" fullWidth {...register('alias')} /> */}

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={isMobile ? 2 : 2}
                justifyContent={'flex-start'}
              >
                <LoadingButton
                  loading={isPending}
                  variant="contained"
                  size="medium"
                  type="submit"
                  fullWidth
                >
                  Add new project
                </LoadingButton>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  color="error"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddProject
