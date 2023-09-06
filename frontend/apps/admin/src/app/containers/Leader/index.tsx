/*
 *
 * Leaderboard
 *
 */
import { useCallback, useContext, useEffect, useState } from 'react';

import DataTable from '../../components/DataTable';
import Header from '../../components/Header';

import { BASE_URL, DataSet, SnackbarContext } from '@its/common';
import { query } from '../../services/admin';

import ExportToExcel from '../../components/ExportToExcel';

const dataset: DataSet[] = [
  {
    title: 'Ảnh',
    value: 'userId.image',
    type: 'image',
  },
  {
    title: 'Mã Sinh Viên',
    value: 'userId.studentCode',
    type: 'string',
  },
  {
    title: 'Tên Sinh Viên',
    value: 'userId.studentName',
    type: 'string',
  },
  {
    title: 'Điểm Thi',
    value: 'playScore',
    type: 'string',
  },
  {
    title: 'Điểm Thái Độ',
    value: 'attitudeScore',
    type: 'string',
  },
  {
    title: 'Điểm Kiến Thức',
    value: 'knowledgeScore',
    type: 'string',
  },
  {
    title: 'Tổng Điểm',
    value: 'totalScore',
    type: 'string',
  },
];

let interval: any;

export default function Leaderboard() {
  //====================================== Hook ======================================
  const Snackbar = useContext(SnackbarContext);
  const [play, setPlay] = useState([]);
  //====================================== Callback ======================================
  const getPlay = useCallback(() => {
    query('/play/leaderboard')
      .then((data: any) => {
        if (data) {
          const list: any = data.data.map((item: any) => {
            if (item.userId.image) item.userId.image = `${BASE_URL}/public/${item.userId.image}`;
            return item;
          });
          setPlay(list);
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
      <DataTable loading={!play} isLeaderboard dataset={dataset} data={play} />
    </>
  );
}
