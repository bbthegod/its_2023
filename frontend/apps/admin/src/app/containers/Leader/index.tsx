/*
 *
 * Leaderboard
 *
 */
import { useCallback, useContext, useEffect, useState } from 'react';

import DataTable from '../../components/DataTable';
import Header from '../../components/Header';

import { SnackbarContext } from '@its/common';
import { query } from '../../services/admin';

import ExportToExcel from '../../components/ExportToExcel';

const heading = ['Mã Sinh Viên', 'Tên Sinh Viên', 'Điểm Thi', 'Điểm Thái Độ', 'Điểm Kiến Thức', 'Tổng Điểm'];
const value = ['userId.studentCode', 'userId.studentName', 'playScore', 'attitudeScore', 'knowledgeScore', 'totalScore'];

let interval: any;

export default function Leaderboard() {
  //====================================== Hook ======================================
  const Snackbar = useContext(SnackbarContext);
  const [play, setPlay] = useState();
  //====================================== Callback ======================================
  const getPlay = useCallback(() => {
    query('/play/leaderboard')
      .then((data: any) => {
        if (data) {
          setPlay(data.data ?? []);
        }
      })
      .catch(() => {
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar]);
  //====================================== Effect ======================================
  useEffect(() => {
    getPlay();
    interval = setInterval(() => {
      getPlay();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [getPlay]);
  //====================================== Render ======================================
  if (!play) return null;
  return (
    <>
      <ExportToExcel data={play} />
      <Header title="Bảng Xếp Hạng" subtitle="Quản lý" />
      <DataTable loading={!play} isLeaderboard heading={heading} value={value} data={play} />
    </>
  );
}
