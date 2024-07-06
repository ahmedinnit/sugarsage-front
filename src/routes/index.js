import { useRoutes } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// project import
import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';
import ErrorPage from '../pages/ErrorPage';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  // console.log(
  //   'yELLLLE: ',
  //   useSelector((state) => state)
  // );
  // const { isAuthenticated, role } = useSelector((state) => state.auth);
  // console.log('isAuth: ', isAuthenticated);
  // console.log('user: ', role);
  // let routes = LoginRoutes;
  // if (isAuthenticated && role == 'admin') routes = AdminRoutes;
  // else if (isAuthenticated && role == 'user') routes = UserRoutes;
  return useRoutes([AdminRoutes, AuthRoutes, UserRoutes, { path: '*', element: <ErrorPage /> }]);

  // return useRoutes([routes]);
}
