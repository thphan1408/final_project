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
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { LoadingButton } from '@mui/lab'
// import { GROUP_CODE } from '../../../../../constants'
// import Swal from 'sweetalert2'
// import {
//   getMovieDetailsAPI,
//   updateMovieAPI,
// } from '../../../../../apis/movieAPI'
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

// const UpdateMovie = ({ maPhim, handleClose }) => {
//   const queryClient = useQueryClient()

//   // Cập nhật phim
//   const { mutate: handleUpdateMovie, isPending } = useMutation({
//     mutationFn: (payload) => {
//       updateMovieAPI(payload)
//     },
//     onSuccess: () => {
//       handleClose()

//       // Hiển thị thông báo thành công (nếu cần)
//       Swal.fire({
//         icon: 'success',
//         title: 'Cập nhật phim thành công',
//         confirmButtonText: 'Ok luôn',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           queryClient.invalidateQueries('get-list-movie')
//         }
//       })
//     },
//   })

//   // Lấy dữ liệu phim cần cập nhật
//   const {
//     data = {},
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['get-movie-details', maPhim],
//     queryFn: () => getMovieDetailsAPI(maPhim),
//     enabled: !!maPhim,
//     // false | true, khi enabled là true thì queryFun mới được kích hoạt. Ngược lại là false thì sẽ không kích hoạt queryFun
//   })

//   const { handleSubmit, register, control, setValue, watch } = useForm({
//     defaultValues: {
//       tenPhim: data.tenPhim || '',
//       trailer: data.trailer || '',
//       moTa: data.moTa || '',
//       maNhom: GROUP_CODE,
//       ngayKhoiChieu: data.ngayKhoiChieu || '',
//       danhGia: data.danhGia || '',
//       dangChieu: data.dangChieu || '',
//       sapChieu: data.sapChieu || '',
//       hot: data.hot || '',
//       hinhAnh: data.hinhAnh || undefined,
//     },
//   })

//   useEffect(() => {
//     // Set default values when data changes
//     setValue('tenPhim', data.tenPhim || '')
//     setValue('trailer', data.trailer || '')
//     setValue('moTa', data.moTa || '')
//     setValue('ngayKhoiChieu', data.ngayKhoiChieu || '')
//     setValue('danhGia', data.danhGia || '')
//     setValue('dangChieu', data.dangChieu || '')
//     setValue('sapChieu', data.sapChieu || false)
//     setValue('hot', data.hot || false)
//     setValue('hinhAnh', data.hinhAnh || undefined)
//   }, [data, setValue, control])

//   const file = watch('hinhAnh') // [0]

//   const handleChange = (event) => {
//     const file = event.target.files[0]
//     setValue('hinhAnh', file)
//   }

//   const onSubmitUpdate = (values) => {
//     const formData = new FormData()

//     formData.append('maPhim', maPhim)
//     formData.append('tenPhim', values.tenPhim)
//     formData.append('trailer', values.trailer)
//     formData.append('moTa', values.moTa)
//     formData.append('maNhom', GROUP_CODE)
//     formData.append('sapChieu', values.sapChieu)
//     formData.append('dangChieu', values.dangChieu || false)
//     formData.append('hot', values.hot)
//     formData.append('ngayKhoiChieu', values.ngayKhoiChieu)
//     formData.append('danhGia', values.danhGia)

//     // Nếu có hình ảnh mới thì mới append vào formData
//     if (file) {
//       formData.append('hinhAnh', values.hinhAnh)
//     }

//     handleUpdateMovie(formData)
//   }

//   const previewImage = (file) => {
//     // return file ? URL.createObjectURL(new Blob([file])) : ''
//     if (file instanceof File || file instanceof Blob) {
//       return URL.createObjectURL(file)
//     } else if (typeof file === 'string') {
//       return file // Assuming it's already a URL
//     } else {
//       return '' // Handle other cases or return a default URL
//     }
//   }

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
//             <form onSubmit={handleSubmit(onSubmitUpdate)}>
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
//                           const formattedDate =
//                             dayjs(date).format('DD/MM/YYYY ~ HH:mm')
//                           setValue('ngayKhoiChieu', formattedDate)
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
//                     render={({ field }) => (
//                       <Rating
//                         {...field}
//                         name="size-medium"
//                         defaultValue={0}
//                         max={10}
//                         value={parseInt(watch('danhGia'))} // Chuyển đổi giá trị thành số
//                         onChange={(event) => {
//                           setValue('danhGia', event.target.defaultValue)
//                         }}
//                       />
//                     )}
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
//                           checked={watch('hot')}
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
//                       onChange={handleChange}
//                     />
//                   </Button>
//                 )}

//                 {file && (
//                   <>
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img
//                         src={
//                           typeof file === 'string' ? file : previewImage(file)
//                         }
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
//                   disabled={isPending}
//                   variant="contained"
//                   size="large"
//                   type="submit"
//                 >
//                   Cập nhật phim
//                 </LoadingButton>
//               </Stack>
//             </form>
//           </Grid>
//         </Grid>
//       </Box>
//     </LocalizationProvider>
//   )
// }

// export default UpdateMovie
