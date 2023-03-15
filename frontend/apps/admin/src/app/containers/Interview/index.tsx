/*
 *
 * Interview
 *
 */
import { useState, useEffect, useContext, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  //====================================== Querry ======================================
  const { isLoading, error, data, refetch } = useQuery(['plays'], () => query('/play'));
  const interview = useMutation((data: any) => mutation(`/play/interview/${data._id}`, data));
  const users = data?.data ?? [];
  if (error) {
    Snackbar?.open('Lấy dữ liệu thất bại', 'error');
  }
  if (interview.error) {
    Snackbar?.open('Tạo người dùng thất bại', 'error');
  }
  if (interview.isSuccess) {
    refetch();
    interview.reset();
  }
  //====================================== Effect ======================================
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
  //====================================== Callback ======================================
  const handleChangeSearch = (data: Play) => {
    console.log(data)
    if (data) {
      setUserDetail(data);
    } else {
      setUserDetail(undefined);
    }
  };

  const handleSubmit = (attitudeScore: number, knowledgeScore: number, comment: string) => {
    if (usersDetail) {
      if (localStorage.getItem('interviewer')) {
        interview.mutate({
          ...usersDetail,
          attitudeScore,
          knowledgeScore,
          comment,
          interviewer: localStorage.getItem('interviewer'),
        });
      }
      setUserDetail(undefined);
    } else {
      alert('Chọn một sinh viên !');
    }
  };
  //====================================== Render ======================================
  if (isLoading) return null;
  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className="col-span-4">
        <div className="bg-base-100 shadow-md p-5">
          <h1 className="mb-5 text-lg font-semibold text-center">
            THÔNG TIN SINH VIÊN
          </h1>
          {users && users.length > 0 && (
            <div className="mb-5 w-[300px] w-full">
              <Autocomplete
                data={users}
                value={usersDetail}
                onChange={handleChangeSearch}
                label="Mã Sinh Viên"
              />
            </div>
          )}

          {usersDetail && (<UserDetail usersDetail={usersDetail} handleSubmit={handleSubmit} />)}
        </div>
      </div>
      <div className="text-center col-span-8">
        <PaperList />
      </div>
    </div>
  );
}

interface AutocompleteProps {
  data: any[]
  label: string
  value: Play | undefined
  onChange: (data: Play) => void
}

const Autocomplete = (props: AutocompleteProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLUListElement>(null)

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
        {open && (
          <div className='bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[800]' onClick={() => setOpen(false)} />
        )}
        {open && (
          <ul className="absolute top-14 menu bg-base-100 w-full border border-[#000] z-[801]" ref={ref}>
            {props.data.filter((item: any) => item.userId.studentCode.includes(search)).map((item: any) => (
              <li 
                onClick={() => {
                  props.onChange(item)
                  setOpen(false)
                }} 
              >
                <a className={`${item.userId.studentCode === props.value?.userId.studentCode ? "active" : ""}`}>
                  {item.userId.studentCode}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}