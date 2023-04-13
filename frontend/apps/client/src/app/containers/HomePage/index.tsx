/*
 *
 * HomePage
 *
 */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PlayData, SnackbarContext, request, useAuth } from '@its/common';

export default function HomePage() {
  const [playData, setPlayData] = useState<PlayData>();
  const { auth, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  //====================================== Hooks ======================================
  const Snackbar = useContext(SnackbarContext);
  const navigate = useNavigate();
  //====================================== Callback ======================================
  const handleReady = () => {
    if (playData && playData.timeOut) {
      redirection(playData);
    } else {
      startPlay();
    }
  };

  const redirection = useCallback(
    (data: any) => {
      if (data && data.timeOut) {
        if (new Date(data.timeOut).getTime() - new Date(Date.now()).getTime() <= 0) {
          navigate('/ended');
        } else {
          navigate('/play');
        }
      }
    },
    [navigate],
  );

  const startPlay = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await request({
        url: `/play/start`,
        method: 'GET',
      });
      if (response && response.data) {
        redirection(response.data);
      } else {
        Snackbar?.open('Có lỗi xảy ra', 'error');
      }
    } catch (error) {
      Snackbar?.open('Có lỗi xảy ra', 'error');
    }
    setLoading(false);
  }, [Snackbar, redirection]);

  const getPlay = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await request({
        url: `/play/get`,
        method: 'GET',
      });
      if (response && response.data) {
        setPlayData(response.data);
      }
    } catch (error) {
      // Snackbar.open('Có lỗi xảy ra', 'error');
    }
    setLoading(false);
  }, []);
  //====================================== Effect ======================================
  useEffect(() => {
    getPlay();
  }, [getPlay]);
  //====================================== Render ======================================
  return (
    <div className="p-4 grow flex flex-col justify-between">
      <div className="pt-16">
        <div className="my-4">
          <h1 className="font-semibold text-3xl text-center mb-4">Luật chơi</h1>
          <h4 className="font-semibold text-xl mb-2">- Chọn 1 đáp án duy nhất.</h4>
          <h4 className="font-semibold text-xl mb-2">- Thời gian làm bài là 25 phút.</h4>
          <h4 className="font-semibold text-xl mb-2">- Tổng điểm sẽ được tính cùng vào điểm khi phỏng vấn.</h4>
          <h2 className="font-bold text-xl text-center">IT Suppporter chúc các bạn may mắn.</h2>
        </div>
        <button className={`btn btn-block ${loading ? 'loading' : ''}`} onClick={handleReady} color="primary">
          BẮT ĐẦU
        </button>
      </div>
      <div className="flex rounded-sm">
        <div className="grow">
          <p className="font-semibold text-[18px] h-6">{auth?.studentName}</p>
          <p className="font-semibold text-[18px] h-6">{auth?.studentCode}</p>
        </div>
        <button className="btn btn-square" onClick={logout}>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
