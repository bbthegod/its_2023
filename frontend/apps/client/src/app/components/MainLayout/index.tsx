/*
 *
 * MainLayout
 *
 */
import * as React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@its/common';

interface Props {
  protected?: boolean;
  entry?: boolean;
  children?: any;
}

export default function MainLayout(props: Props) {
  const { auth } = useAuth();
  const navigate = useNavigate()
  const location = useLocation()

  if (auth && props.entry) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!auth && props.protected) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {!props.entry && (
        <div className="w-full h-[50px] px-4 flex items-center">
          <div className="w-8 h-8 shrink-0">
            {location.pathname !== '/' && (
              <button className="btn btn-sm btn-square btn-ghost" onClick={() => navigate("/")}>
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative w-full h-full flex items-center justify-center left-0 right-0 top-0">
            <img src="/assets/images/justlogo.png" alt="logo" className="w-8 h-8" />
          </div>

          <div className="w-8 h-8 shrink-0" />
        </div>
      )}
      <Outlet />
    </>
  );
}
