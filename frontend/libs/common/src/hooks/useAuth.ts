import { useMemo } from 'react';

interface AuthType {
  token: string;
  studentCode: string;
  studentName: string;
  id: string;
}

export function useAuth() {
  const auth: AuthType | null = useMemo(() => {
    const auth = localStorage.getItem('auth');
    try {
      if (auth) {
        const decoded = JSON.parse(auth);
        return decoded as AuthType;
      }
    } catch (err) {
      localStorage.removeItem('auth');
      window.location.href = 'login';
    }
    return null;
  }, [localStorage.getItem('auth')]);

  const setAuth = (data: any, callback: any) => {
    const auth: AuthType = {
      token: data?.token,
      studentCode: data?.user?.studentCode,
      studentName: data?.user?.studentName,
      id: data?.user?.id,
    };
    localStorage.setItem('auth', JSON.stringify(auth));
    callback();
  };

  const logout = () => {
    try {
      localStorage.removeItem('auth');
      window.location.href = 'login';
    } catch (err) {
      console.log(err);
    }
  };

  return { auth, setAuth, logout };
}
