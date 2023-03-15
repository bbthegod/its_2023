/*
 *
 * Leaderboard
 *
 */
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import DataTable from '../../components/DataTable';
import Header from '../../components/Header';

import { SnackbarContext } from '@its/common';
import { query } from '../../services/admin';

import ExportToExcel from '../../components/ExportToExcel';

const heading = ['Mã Sinh Viên', 'Tên Sinh Viên', 'Điểm Thi', 'Điểm Thái Độ', 'Điểm Kiến Thức', 'Tổng Điểm'];
const value = ['userId.studentCode', 'userId.studentName', 'playScore', 'attitudeScore', 'knowledgeScore', 'totalScore'];

export default function Leaderboard() {
  //====================================== Hook ======================================
  const Snackbar = useContext(SnackbarContext);
  //====================================== Querry ======================================
  const { isLoading, error, data: usersData } = useQuery(['leaderboard'], () => query('/play/leaderboard'), { refetchInterval: 10000 });
  const users = usersData?.data
  if (error) {
    Snackbar?.open('Lấy dữ liệu thất bại', 'error');
  }
  //====================================== Render ======================================
  return (
    <>
      <ExportToExcel data={users ?? []} />
      <Header title="Bảng Xếp Hạng" subtitle="Quản lý" />
      <DataTable loading={isLoading} isLeaderboard heading={heading} value={value} data={users ?? []} />
    </>
  );
}
