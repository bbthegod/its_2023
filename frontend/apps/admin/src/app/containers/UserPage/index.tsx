/*
 *
 * UserPage
 *
 */
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { BASE_URL, DataSet, SnackbarContext, User } from '@its/common';

import { mutation, query } from '../../services/admin';
import UserDialog from '../../components/UserDialog';
import SearchBar from '../../components/SearchBar';
import DataTable from '../../components/DataTable';
import Header from '../../components/Header';

const dataset: DataSet[] = [
  {
    title: 'Ảnh Đại Diện',
    value: 'image',
    type: 'image',
  },
  {
    title: 'Mã Sinh Viên',
    value: 'studentCode',
    type: 'string',
  },
  {
    title: 'Tên Sinh Viên',
    value: 'studentName',
    type: 'string',
  },
  {
    title: 'Lớp-Khoá',
    value: 'studentClass',
    type: 'string',
  },
  {
    title: 'Số Điện Thoại',
    value: 'studentPhone',
    type: 'string',
  },
];

export default function UserPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  //====================================== Constant ======================================
  const filter = useMemo(() => {
    return search
      ? {
          limit: rowsPerPage,
          skip: page * rowsPerPage,
          search,
        }
      : {
          limit: rowsPerPage,
          skip: page * rowsPerPage,
        };
  }, [page, rowsPerPage, search]);
  //====================================== Callback ======================================
  const getUsers = useCallback(() => {
    query('/user', filter)
      .then((data: any) => {
        if (data) {
          if (data.data) {
            const list: any = data.data.map((item: any) => {
              if (item.image) item.image = `${BASE_URL}/public/${item.image}`;
              return item;
            });
            setUsers(list);
          } else {
            setUsers([]);
          }
          setCount(data.count);
        }
      })
      .catch((e: any) => {
        console.log(e);
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar, filter]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = (data: User) => {
    mutation('/user', data)
      .then(() => {
        Snackbar?.open('Tạo người dùng thành công', 'success');
        getUsers();
        setOpen(false);
      })
      .catch(() => {
        Snackbar?.open('Tạo người dùng thất bại', 'error');
        setOpen(false);
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getUsers();
  }, [filter, getUsers]);
  //====================================== Render ======================================
  return (
    <>
      <Header setOpen={setOpen} title="Sinh Viên" subtitle="Quản lý" />
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        isLeaderboard={false}
        title="user"
        dataset={dataset}
        loading={!users}
        data={users}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
      />
      <UserDialog setOpen={setOpen} open={open} handleSubmit={handleCreate} />
    </>
  );
}
