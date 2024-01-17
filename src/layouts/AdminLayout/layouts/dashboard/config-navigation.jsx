import { useDispatch, useSelector } from 'react-redux'
import SvgColor from '../../components/svg-color'
import { projectsActions } from '../../redux/projects/slice'

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/public/assets/icons/navbar${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
)

const navConfig = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Project Management',
    path: 'project',
  },
  {
    title: 'User Management',
    path: 'user',
    icon: icon('ic_user'),
  },
  // {
  //   title: `Project Detail`,
  //   path: `project-detail/:id`,
  // },
  // {
  //   title: 'Profile Management',
  //   path: 'profile',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'Not found',
  //   path: '404',
  //   // icon: icon('ic_disabled'),
  // },
]

export default navConfig
