/*
 *
 * UserPage
 *
 */
import { useContext, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { SnackbarContext, User } from '@its/common';

import { mutation, query } from '../../services/admin';
import UserDialog from '../../components/UserDialog';
import SearchBar from '../../components/SearchBar';
import DataTable from '../../components/DataTable';
import Header from '../../components/Header';

const heading = ['Mã Sinh Viên', 'Tên Sinh Viên', 'Lớp-Khoá', 'Số Điện Thoại'];
const value = ['studentCode', 'studentName', 'studentClass', 'studentPhone'];

export default function UserPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  //====================================== Constant ======================================
  const filter = useMemo(() => {
    return search ? {
      limit: rowsPerPage,
      skip: page * rowsPerPage,
      search,
    } : {
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    };
  }, [page, rowsPerPage, search]);
  //====================================== Querry ======================================
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['users', {url: '/user', filters: filter }],
    queryFn: async () => {
      const data = await query('/user', filter)
      return data
    },
  })
  const create = useMutation((data: User) => mutation('/user', data));
  const users = data?.data ?? [];
  const count = data?.count ?? 0;
  if (error) {
    Snackbar?.open('Lấy dữ liệu thất bại', 'error');
  }
  if (create.error) {
    Snackbar?.open('Tạo người dùng thất bại', 'error');
  }
  if (create.isSuccess) {
    refetch();
    create.reset();
  }
  //====================================== Callback ======================================
  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = (data: User) => {
    create.mutate(data);
    setOpen(false);
  };
  //====================================== Render ======================================
  return (
    <>
      <Header setOpen={setOpen} title="Sinh Viên" subtitle="Quản lý" />
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        isLeaderboard={false}
        title="user"
        heading={heading}
        loading={isLoading}
        value={value}
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
