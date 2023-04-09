/*
 *
 * UserDetail
 *
 */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { SnackbarContext, User } from '@its/common';
import { mutation, query } from '../../services/admin';

import ConfirmDialog from '../../components/ConfirmDialog';
import ContentDetail from '../../components/ContentDetail';
import UserDialog from '../../components/UserDialog';
import Header from '../../components/Header';
import Play from '../../components/Play';

const heading = ['Mã Sinh Viên', 'Tên Sinh Viên', 'Lớp-Khoá', 'Số Điện Thoại'];
const value = ['studentCode', 'studentName', 'studentClass', 'studentPhone'];

export default function UserDetail() {
  //====================================== Hook ======================================
  const navigate = useNavigate();
  const { id } = useParams();
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [removeDialog, setRemoveDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [user, setUser] = useState<User>();
  const [play, setPlay] = useState();
  const [tab, setTab] = useState(0);
  //====================================== Callback ======================================
  const getUser = useCallback(() => {
    query(`/user/${id}`)
      .then(data => {
        if (data) setUser(data.data);
      })
      .catch(() => {
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar, id]);

  const getPlay = useCallback(() => {
    query(`/play/user/${id}`).then(data => {
      if (data) setPlay(data.data);
    });
  }, [id]);

  const handleRemove = () => {
    mutation(`/user/${id}`, null, 'DELETE')
      .then(() => {
        Snackbar?.open('Xoá người dùng thành công', 'success');
        navigate('/user');
      })
      .catch(() => {
        Snackbar?.open('Xoá người dùng thất bại', 'error');
      });
  };

  const handleReset = () => {
    mutation(`/play/${id}`, null, 'DELETE')
      .then(() => {
        Snackbar?.open('Khôi phục vòng chơi thành công', 'success');
        navigate('/user');
      })
      .catch(() => {
        Snackbar?.open('Khôi phục vòng chơi thất bại', 'error');
      });
  };

  const handleSubmit = (data: any) => {
    mutation(`/user/${id}`, data, 'PUT')
      .then(() => {
        Snackbar?.open('Cập nhật người dùng thành công', 'success');
        navigate('/user');
      })
      .catch(() => {
        Snackbar?.open('Cập nhật người dùng thất bại', 'error');
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    if (id) {
      getUser();
      getPlay();
    }
  }, [Snackbar, getPlay, getUser, id]);
  //====================================== Render ======================================
  if (!user) return null;
  return (
    <div>
      <Header subtitle="Người Dùng" title={user ? user.studentName : ''} />
      <div className="tabs mt-6">
        <a className={`tab tab-bordered ${tab === 0 ? 'tab-active' : ''}`} onClick={() => setTab(0)}>
          SINH VIÊN
        </a>
        <a className={`tab tab-bordered ${tab === 1 ? 'tab-active' : ''}`} onClick={() => setTab(1)}>
          VÒNG CHƠI
        </a>
      </div>
      <div className="mt-6">
        {tab === 0 && user && (
          <ContentDetail title="Thông tin sinh viên" heading={heading} value={value} data={user}>
            <button onClick={() => setEditDialog(true)} className="text-[#2196f3] btn btn-ghost btn-sm">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
              Sửa
            </button>
            <button onClick={() => setRemoveDialog(true)} className="text-[#f44336] btn btn-ghost btn-sm">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Xoá
            </button>
            <button onClick={() => setResetDialog(true)} className="text-[#4caf50] btn btn-ghost btn-sm">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Đặt lại vòng chơi
            </button>
          </ContentDetail>
        )}
        {tab === 1 && <Play play={play} />}
      </div>
      <ConfirmDialog open={removeDialog} setOpen={setRemoveDialog} message="Xoá người dùng này ?" handleAction={handleRemove} />
      <ConfirmDialog open={resetDialog} setOpen={setResetDialog} message="Đặt lại vòng chơi ?" handleAction={handleReset} />
      {user && <UserDialog data={user} setOpen={setEditDialog} open={editDialog} handleSubmit={handleSubmit} />}
    </div>
  );
}
