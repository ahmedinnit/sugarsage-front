import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { UserRoute } from './RestrictedRoutes';

const Dashboard = Loadable(lazy(() => import('pages/user/Dashboard')));
const MealPlans = Loadable(lazy(() => import('pages/user/MealPlan')));
const ChooseMeal = Loadable(lazy(() => import('pages/user/ChooseMeals')));
// const HTrack = Loadable(lazy(() => import('pages/user/HealthTrack')));
// const ATrack = Loadable(lazy(() => import('pages/user/ActivityTrack')));
const Feedback = Loadable(lazy(() => import('pages/user/Feedback')));
const Blog = Loadable(lazy(() => import('pages/user/Blogs')));
const UserProfile = Loadable(lazy(() => import('pages/user/UserProfile')));
const HealthProfile = Loadable(lazy(() => import('pages/user/HealthProfile')));
// const Settings = Loadable(lazy(() => import('pages/user/Settings')));
// const TAC = Loadable(lazy(() => import('pages/user/TAC')));

const UserRoutes = {
  path: '/user',
  element: (
    <UserRoute>
      <MainLayout />
    </UserRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> },
    { path: '/user/dashboard', element: <Dashboard /> },
    { path: '/user/mealplan', element: <MealPlans /> },
    { path: '/user/mealplan/choose', element: <ChooseMeal /> },
    // { path: '/user/healthtrack', element: <HTrack /> },
    // { path: '/user/activitytrack', element: <ATrack /> },
    { path: '/user/feedback', element: <Feedback /> },
    { path: '/user/blogs', element: <Blog /> },
    { path: '/user/uprofile', element: <UserProfile /> },
    { path: '/user/hprofile', element: <HealthProfile /> }
    // { path: '/user/settings', element: <Settings /> }
    // { path: '/user/tac', element: <TAC /> }
  ]
};

export default UserRoutes;
