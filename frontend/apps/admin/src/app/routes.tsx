import { useRoutes } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage';
import MainLayout from './components/MainLayout';
import LoginPage from './containers/LoginPage';
import UserPage from './containers/UserPage';
import UserDetail from './containers/UserDetail';
import QuestionPage from './containers/QuestionPage';
import QuestionDetail from './containers/QuestionDetail';
import Interview from './containers/Interview';
import Leader from './containers/Leader';

const routers = [
  //Router for authentication
  {
    element: <LoginPage />,
    path: '/login',
  },
  {
    element: <MainLayout protected />,
    children: [
      { path: '/', element: <UserPage /> },
      { path: '/user', element: <UserPage /> },
      { path: '/user/:id', element: <UserDetail /> },
      { path: '/question', element: <QuestionPage /> },
      { path: '/question/:id', element: <QuestionDetail /> },
      { path: '/interview', element: <Interview /> },
      { path: '/leaderboard', element: <Leader /> },
    ],
    path: '/',
  },
  //Router for public
  {
    authentication: false,
    element: <MainLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
    path: '*',
  },
];

export default function Routers() {
  return useRoutes(routers);
}
