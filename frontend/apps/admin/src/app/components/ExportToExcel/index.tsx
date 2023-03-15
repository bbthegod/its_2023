/*
 *
 * ExportToExcel
 *
 */
import React from 'react';
import { CSVLink } from 'react-csv';

export default function ExportToExcel({ data }: any) {
  const dataSet = React.useMemo(() => {
    const rs = [
      [
        'Mã Sinh Viên',
        'Tên Sinh Viên',
        'Lớp - Khoá',
        'Số Điện Thoại',
        'Điểm Thi',
        'Điểm Thái Độ',
        'Điểm Kiến Thức',
        'Tổng Điểm',
        'Người Phỏng Vấn',
        'Ghi Chú',
      ],
    ];
    data.forEach((element: any) => {
      const temp = [];
      temp.push(element?.userId?.studentCode ?? '');
      temp.push(element?.userId?.studentName ?? '');
      temp.push(element?.userId?.studentClass ?? '');
      temp.push(element?.userId?.studentPhone ?? '');
      temp.push(element?.playScore ?? '');
      temp.push(element?.attitudeScore ?? '');
      temp.push(element?.knowledgeScore ?? '');
      temp.push(element?.totalScore ?? '');
      temp.push(element?.interviewer ?? '');
      temp.push(element?.comment ?? '');
      rs.push(temp);
    });
    return rs;
  }, [data]);
  return (
    <CSVLink filename={'itsupporter.csv'} target="_blank" data={dataSet}>
      <button className="btn btn-primary float-right mt-4">
        Xuất Excel
      </button>
    </CSVLink>
  );
}
