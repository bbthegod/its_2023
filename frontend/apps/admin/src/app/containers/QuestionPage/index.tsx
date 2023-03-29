/*
 *
 * QuestionPage
 *
 */
import { useContext, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { SnackbarContext, User } from '@its/common';

import QuestionDialog from '../../components/QuestionDialog';
import { mutation, query } from '../../services/admin';
import SearchBar from '../../components/SearchBar';
import DataTable from '../../components/DataTable';
import Header from '../../components/Header';

const heading = ['Nội dung', 'Độ Khó', 'Câu trả lời 1', 'Câu trả lời 2', 'Câu trả lời 3', 'Câu trả lời 4'];
const value = ['content', 'level', 'options[0].answer', 'options[1].answer', 'options[2].answer', 'options[3].answer'];

export default function QuestionPage() {
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
    queryKey: ['questions', {url: '/question', filters: filter }],
    queryFn: async () => {
      const data = await query('/question', filter)
      return data
    },
  })
  const create = useMutation((data: User) => mutation('/question', data));
  const questions = data?.data ?? [];
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <Header setOpen={setOpen} title="Câu Hỏi" subtitle="Quản lý" />
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        isLeaderboard={false}
        title="question"
        heading={heading}
        loading={isLoading}
        value={value}
        data={questions}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
      />
      <QuestionDialog setOpen={setOpen} open={open} handleSubmit={handleCreate} />
    </>
  );
}
