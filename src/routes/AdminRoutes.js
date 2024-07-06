import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { AdminRoute } from './RestrictedRoutes';

const DashboardDefault = Loadable(lazy(() => import('pages/admin/Dashboard')));
const User = Loadable(lazy(() => import('pages/admin/User')));
const Food = Loadable(lazy(() => import('pages/admin/Food')));
// const Dish = Loadable(lazy(() => import('pages/admin/Dish')));
const Feedback = Loadable(lazy(() => import('pages/admin/Feedback')));
const Blog = Loadable(lazy(() => import('pages/admin/Blog')));
const Profile = Loadable(lazy(() => import('pages/admin/Profile')));

const AdminRoutes = {
  path: '/admin',
  element: (
    <AdminRoute>
      <MainLayout />
    </AdminRoute>
  ),
  children: [
    { index: true, element: <DashboardDefault /> },
    { path: '/admin/dashboard', element: <DashboardDefault /> },
    { path: '/admin/users', element: <User /> },
    { path: '/admin/food', element: <Food /> },
    // { path: '/admin/dish', element: <Dish /> },
    { path: '/admin/feedback', element: <Feedback /> },
    { path: '/admin/blog', element: <Blog /> },
    { path: '/admin/profile', element: <Profile /> }
  ]
};

export default AdminRoutes;
