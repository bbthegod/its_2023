/*
 *
 * QuestionPage
 *
 */
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
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
  const getQuestions = useCallback(() => {
    query('/question', filter)
      .then((data: any) => {
        if (data) {
          setQuestions(data.data);
          setCount(data.count);
        }
      })
      .catch(() => {
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar, filter]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = (data: User) => {
    mutation('/question', data)
      .then(() => {
        Snackbar?.open('Tạo câu hỏi thành công', 'success');
        getQuestions();
        setOpen(false);
      })
      .catch(() => {
        Snackbar?.open('Tạo câu hỏi thất bại', 'error');
        setOpen(false);
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getQuestions();
  }, [filter, getQuestions]);
  //====================================== Render ======================================
  return (
    <>
      <Header setOpen={setOpen} title="Câu Hỏi" subtitle="Quản lý" />
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        isLeaderboard={false}
        title="question"
        heading={heading}
        loading={!questions}
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
