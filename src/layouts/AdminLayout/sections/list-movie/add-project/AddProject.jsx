// import React, { useEffect, useState } from 'react'
// import Rating from '@mui/material/Rating'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload'
// import {
//   Box,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
//   Button,
//   FormControlLabel,
//   Switch,
// } from '@mui/material'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { styled } from '@mui/material/styles'
// import { useForm, Controller } from 'react-hook-form'
// import dayjs from 'dayjs'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { LoadingButton } from '@mui/lab'
// import { GROUP_CODE } from '../../../../../constants'
// import { addMovieAPI } from '../../../../../apis/movieAPI'
// import Swal from 'sweetalert2'

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// })

// const AddMovie = ({ handleClose }) => {
//   const queryClient = useQueryClient()
//   const { handleSubmit, register, control, setValue, watch } = useForm({
//     defaultValues: {
//       tenPhim: '',
//       trailer: '',
//       moTa: '',
//       maNhom: GROUP_CODE,
//       ngayKhoiChieu: '',
//       sapChieu: false,
//       dangChieu: true,
//       hot: false,
//       danhGia: '',
//       hinhAnh: undefined,
//     },
//   })

//   const file = watch('hinhAnh') // [0]

//   // useQuery({queryKey: ['list-movie-admin'] })
//   const { mutate: handleAddMovie, isPending } = useMutation({
//     mutationFn: (payload) => {
//       addMovieAPI(payload)
//     },
//     onSuccess: () => {
//       handleClose()

//       // Hiển thị thông báo thành công (nếu cần)
//       Swal.fire({
//         icon: 'success',
//         title: 'Thêm phim thành công',
//         confirmButtonText: 'Ok luôn',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           queryClient.invalidateQueries('get-list-movie')
//         }
//       })
//     },
//   })

//   const onSubmit = (values) => {
//     const formData = new FormData()
//     // formData.append('tenPhim', values.tenPhim)
//     // formData.append('trailer', values.trailer)
//     // formData.append('moTa', values.moTa)
//     // formData.append('maNhom', values.maNhom)
//     // formData.append('sapChieu', values.sapChieu)
//     // formData.append('dangChieu', values.dangChieu)
//     // formData.append('hot', values.hot)
//     // formData.append('danhGia', values.danhGia)
//     // formData.append('File', values.hinhAnh[0])
//     for (const key in values) {
//       if (key !== 'hinhAnh') {
//         formData.append(key, values[key])
//       } else {
//         formData.append('file', values.hinhAnh[0], values.hinhAnh.name)
//       }
//     }
//     handleAddMovie(formData)
//   }

//   const previewImage = (file) => {
//     return URL.createObjectURL(file)
//   }

//   // useEffect(() => {
//   //   if (file?.length > 0) {
//   //     previewImage(file?.[0]) // url
//   //   }
//   // }, [file])

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box>
//         <Grid
//           container
//           justifyContent={'center'}
//           alignItems={'center'}
//           spacing={3}
//         >
//           <Grid item md={6}>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <Stack spacing={2} direction={'column'}>
//                 <TextField
//                   label="Tên phim"
//                   fullWidth
//                   {...register('tenPhim')}
//                 />
//                 <TextField label="Trailer" fullWidth {...register('trailer')} />
//                 <TextField label="Mô tả" fullWidth {...register('moTa')} />
//                 <Controller
//                   control={control}
//                   name="ngayKhoiChieu"
//                   render={(field) => {
//                     return (
//                       <DatePicker
//                         label="Ngày chiếu"
//                         format="DD/MM/YYYY"
//                         onChange={(date) => {
//                           const value = dayjs(date).format('DD/MM/YYYY')
//                           setValue('ngayKhoiChieu', value)
//                         }}
//                         {...field}
//                       />
//                     )
//                   }}
//                 />

//                 <Stack direction={'row'} spacing={1}>
//                   <Typography component={'h2'}>Đánh giá:</Typography>
//                   <Controller
//                     control={control}
//                     name="danhGia"
//                     render={() => {
//                       return (
//                         <Rating
//                           name="size-medium"
//                           defaultValue={0}
//                           max={10}
//                           onChange={(event) => {
//                             setValue('danhGia', event.target.defaultValue)
//                           }}
//                         />
//                       )
//                     }}
//                   />
//                 </Stack>

//                 <Stack direction={'row'} spacing={1}>
//                   <Typography component={'h2'}>Đang chiếu:</Typography>
//                   <Controller
//                     control={control}
//                     name="dangChieu"
//                     render={() => {
//                       return (
//                         <Switch
//                           checked={watch('dangChieu')}
//                           onChange={(event) => {
//                             setValue('dangChieu', event.target.checked)
//                             setValue('sapChieu', !event.target.checked)
//                           }}
//                         />
//                       )
//                     }}
//                   />
//                 </Stack>

//                 <Stack direction={'row'} spacing={1}>
//                   <Typography component={'h2'}>Sắp chiếu:</Typography>
//                   <Controller
//                     control={control}
//                     name="sapChieu"
//                     render={() => {
//                       return (
//                         <Switch
//                           checked={watch('sapChieu')}
//                           onChange={(event) => {
//                             setValue('sapChieu', event.target.checked)
//                             setValue('dangChieu', !event.target.checked)
//                           }}
//                         />
//                       )
//                     }}
//                   />
//                 </Stack>

//                 <Stack direction={'row'} spacing={1}>
//                   <Typography component={'h2'}>Phim hot:</Typography>
//                   <Controller
//                     control={control}
//                     name="hot"
//                     render={() => {
//                       return (
//                         <Switch
//                           onChange={(event) => {
//                             setValue('hot', event.target.checked)
//                           }}
//                         />
//                       )
//                     }}
//                   />
//                 </Stack>

//                 {(!file || file.length === 0) && (
//                   <Button
//                     component="label"
//                     variant="contained"
//                     startIcon={<CloudUploadIcon />}
//                   >
//                     Upload file
//                     <VisuallyHiddenInput
//                       accept=".png, .gif, .jpg"
//                       type="file"
//                       {...register('hinhAnh')}
//                     />
//                   </Button>
//                 )}

//                 {file?.length > 0 && (
//                   <>
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img
//                         src={previewImage(file[0])}
//                         width={100}
//                         height={100}
//                       />
//                     </Box>

//                     <Button
//                       onClick={() => {
//                         setValue('hinhAnh', undefined)
//                       }}
//                     >
//                       Xóa hình
//                     </Button>
//                   </>
//                 )}

//                 <LoadingButton
//                   loading={isPending}
//                   variant="contained"
//                   size="large"
//                   type="submit"
//                 >
//                   Thêm phim
//                 </LoadingButton>
//               </Stack>
//             </form>
//           </Grid>
//         </Grid>
//       </Box>
//     </LocalizationProvider>
//   )
// }

// export default AddMovie
