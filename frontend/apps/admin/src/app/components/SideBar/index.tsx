/*
 *
 * SideBar
 *
 */
import { useNavigate, useLocation } from 'react-router-dom';

const pages = [
  {
    href: '/leaderboard',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    href: '/user',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    href: '/question',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    href: '/interview',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
        />
      </svg>
    ),
  },
];

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="p-4 fixed w-full md:w-fit h-fit md:h-screen z-[900]">
      <div className="p-2 bg-base-100 shadow-md w-full md:w-fit h-fit md:h-full flex gap-4 flex-row md:flex-col">
        <div className="w-10 h-10 flex justify-center items-center cursor-pointer" onClick={() => navigate('/')}>
          <img alt="Logo" className="w-7 h-7" src="/assets/images/justlogo.png" />
        </div>
        <div className="flex flex-row md:flex-col gap-4 grow">
          {pages.map((page: any) => (
            <div
              key={page.href}
              className={`w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-[#ff980020] ${
                location.pathname.includes(page.href.replace('/', '')) || (location.pathname === '/' && page.href === '/user')
                  ? 'text-success'
                  : 'text-primary'
              }`}
              onClick={() => navigate(page.href)}
            >
              {page.icon}
            </div>
          ))}
        </div>
        <div
          className="w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-[#ff980020]"
          onClick={() => {
            localStorage.clear();
            setTimeout(() => {
              navigate('/login');
            }, 10);
          }}
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-primary w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
