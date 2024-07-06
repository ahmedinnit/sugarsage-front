import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { AuthRoute } from './RestrictedRoutes';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const Signup = Loadable(lazy(() => import('pages/authentication/Signup')));
const ProfileForm = Loadable(lazy(() => import('pages/authentication/ProfileForm')));
const HealthForm = Loadable(lazy(() => import('pages/authentication/HealthForm')));

const AuthRoutes = {
  path: '/',
  element: (
    <AuthRoute>
      <MinimalLayout />
    </AuthRoute>
  ),
  children: [
    { path: '/', element: <AuthLogin /> },
    { path: 'login', element: <AuthLogin /> },
    { path: 'signup', element: <Signup /> },
    { path: 'signup/profile/form', element: <ProfileForm /> },
    { path: 'signup/health/form', element: <HealthForm /> }
  ]
};

export default AuthRoutes;
