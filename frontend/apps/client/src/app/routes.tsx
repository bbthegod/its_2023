import { useRoutes } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage';
import MainLayout from './components/MainLayout';
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';
import PlayPage from './containers/PlayPage';
import EndedPage from './containers/EndedPage';

const routers = [
  //Router for authentication
  {
    element: <MainLayout protected />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/play', element: <PlayPage /> },
      { path: '/ended', element: <EndedPage /> },
    ],
    path: '/',
  },
  {
    element: <MainLayout entry />,
    children: [
      { path: '/login', element: <LoginPage /> },
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
