/*
 *
 * Interview
 *
 */
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Play, SnackbarContext } from '@its/common';

import { mutation, query } from '../../services/admin';

import UserDetail from '../../components/UserDetail';
import PaperList from '../../components/PaperList';

export default function Interview() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== Hook ======================================
  const navigate = useNavigate();
  //====================================== State ======================================
  const [usersDetail, setUserDetail] = useState<Play | undefined>(undefined);
  const [users, setUsers] = useState<Play[]>([]);
  //====================================== Callback ======================================
  const getUsers = useCallback(() => {
    query('/play')
      .then((data: any) => {
        if (data) {
          setUsers(data.data ?? []);
        }
      })
      .catch(() => {
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar]);

  const handleChangeSearch = (data: Play) => {
    if (data) {
      setUserDetail(data);
    } else {
      setUserDetail(undefined);
    }
  };

  const handleSubmit = (attitudeScore: number, knowledgeScore: number, comment: string) => {
    if (usersDetail) {
      if (localStorage.getItem('interviewer')) {
        const data: any = {
          ...usersDetail,
          attitudeScore,
          knowledgeScore,
          comment,
          interviewer: localStorage.getItem('interviewer'),
        };
        mutation(`/play/interview/${data._id}`, data)
          .then(() => {
            getUsers();
            Snackbar?.open('Phỏng vấn thành công', 'success');
          })
          .catch(() => {
            Snackbar?.open('Phỏng vấn thất bại', 'error');
          });
      }
      setUserDetail(undefined);
    } else {
      alert('Chọn một sinh viên !');
    }
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (!localStorage.getItem('interviewer')) {
      const name = prompt('Nhập tên người phỏng vấn');
      if (name != null) {
        localStorage.setItem('interviewer', name);
      } else {
        navigate('/leaderboard');
      }
    }
  }, [navigate]);
  //====================================== Render ======================================
  if (!users) return null;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4">
        <div className="bg-base-100 shadow-md p-5">
          <h1 className="mb-5 text-lg font-semibold text-center">THÔNG TIN SINH VIÊN</h1>
          {users && users.length > 0 && (
            <div className="mb-5 w-[300px] w-full">
              <Autocomplete data={users} value={usersDetail} onChange={handleChangeSearch} label="Mã Sinh Viên" />
            </div>
          )}

          {usersDetail && <UserDetail usersDetail={usersDetail} handleSubmit={handleSubmit} />}
        </div>
      </div>
      <div className="text-center col-span-12 md:col-span-8">
        <PaperList />
      </div>
    </div>
  );
}

interface AutocompleteProps {
  data: any[];
  label: string;
  value: Play | undefined;
  onChange: (data: Play) => void;
}

const Autocomplete = (props: AutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLUListElement>(null);

  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <div className="relative flex flex-col items-center">
        <input
          type="text"
          className="input input-bordered input-primary w-full z-[801]"
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        {open && <div className="bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[800]" onClick={() => setOpen(false)} />}
        {open && (
          <ul className="absolute top-14 menu bg-base-100 w-full border border-[#000] z-[801]" ref={ref}>
            {props.data
              .filter((item: any) => item.userId.studentCode.includes(search))
              .map((item: any) => (
                <li
                  className={item.isInterviewed ? 'bg-[#A5D6A7] cursor-not-allowed pointer-events-none' : ''}
                  key={item.userId.studentCode}
                  onClick={() => {
                    props.onChange(item);
                    setOpen(false);
                  }}
                >
                  <a className={`${item.userId.studentCode === props.value?.userId.studentCode ? 'active' : ''}`}>{item.userId.studentCode}</a>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
