import SvgColor from '../../components/svg-color'

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/public/assets/icons/navbar${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
)

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Project Management',
    path: 'project',
  },
  {
    title: 'user',
    path: 'user',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'Thêm phim upload hình',
  //   path: 'add-movie',
  // },

  // {
  //   title: 'Not found',
  //   path: '404',
  //   // icon: icon('ic_disabled'),
  // },
]

export default navConfig
