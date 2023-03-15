/*
 *
 * MainLayout
 *
 */
import * as React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@its/common';

import SideBar from '../../components/SideBar';

interface Props {
  protected?: boolean;
  entry?: boolean;
  children?: any;
}

export default function MainLayout(props: Props) {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth && props.entry) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!auth && props.protected) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex">
      <SideBar />
      <main className="grow ml-24 m-6">
        <Outlet />
      </main>
    </div>
  );
}
