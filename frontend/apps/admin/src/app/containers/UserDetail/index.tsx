/*
 *
 * UserDetail
 *
 */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BASE_URL, SnackbarContext, User } from '@its/common';
import { mutation, query, upload } from '../../services/admin';

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
  const [file, setFile] = useState<File>();
  //====================================== Callback ======================================
  const getUser = useCallback(() => {
    query(`/user/${id}`)
      .then((data: any) => {
        const u = data.data;
        if (u.image) u.image = `${BASE_URL}/public/${u.image}`;
        if (u) setUser(u);
      })
      .catch(() => {
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar, id]);

  const getPlay = useCallback(() => {
    query(`/play/user/${id}`)
      .then((data: any) => {
        if (data) setPlay(data.data);
      })
      .catch();
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

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      upload(`/user/${id}/upload`, formData)
        .then(() => {
          Snackbar?.open('Tải ảnh người dùng thành công', 'success');
          navigate('/user');
        })
        .catch(() => {
          Snackbar?.open('Tải ảnh người dùng thất bại', 'error');
        });
    }
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
      <div className="mt-6 flex gap-4 justify-center">
        {tab === 0 && user && (
          <>
            <ContentDetail title="Thông tin sinh viên" heading={heading} value={value} data={user}>
              <button onClick={() => setEditDialog(true)} className="text-[#2196f3] btn btn-ghost btn-sm w-fit">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
                Sửa
              </button>
              <button onClick={() => setRemoveDialog(true)} className="text-[#f44336] btn btn-ghost btn-sm w-fit">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Xoá
              </button>
              <button onClick={() => setResetDialog(true)} className="text-[#4caf50] btn btn-ghost btn-sm w-fit">
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
            <div className="flex justify-center">
              <div className="w-fit h-fit bg-base-100 shadow-md p-4">
                <h1 className="text-lg mb-4 text-center font-bold">Ảnh Sinh Viên</h1>
                <hr />
                <div className="my-4 w-48 h-48 relative overflow-hidden flex justify-center items-center aspect-1/1 bg-[#94a3b8] rounded-sm">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
                    <path
                      stroke="#FFFFFF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  {(file || user.image) && (
                    <img src={file ? URL.createObjectURL(file) : user.image} alt="preview" onError={e => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
                <hr />
                {file ? (
                  <>
                    <button className="btn btn-success btn-sm w-full mt-4" onClick={handleUpload}>
                      Xác nhận
                    </button>
                    <button className="btn btn-danger btn-sm w-full mt-2" onClick={() => setFile(undefined)}>
                      Huỷ bỏ
                    </button>
                  </>
                ) : (
                  <button className="text-[#3b82f6] btn btn-ghost btn-sm w-full mt-4">
                    <label className="cursor-pointer">
                      Tải lên
                      <input
                        type="file"
                        value={file}
                        onChange={e => {
                          setFile(e.target.files?.[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
        {tab === 1 && <Play play={play} />}
      </div>
      <ConfirmDialog open={removeDialog} setOpen={setRemoveDialog} message="Xoá người dùng này ?" handleAction={handleRemove} />
      <ConfirmDialog open={resetDialog} setOpen={setResetDialog} message="Đặt lại vòng chơi ?" handleAction={handleReset} />
      {user && <UserDialog data={user} setOpen={setEditDialog} open={editDialog} handleSubmit={handleSubmit} />}
    </div>
  );
}
