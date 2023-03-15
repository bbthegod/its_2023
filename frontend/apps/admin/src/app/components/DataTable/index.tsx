/*
 *
 * DataTable
 *
 */
import { useEffect, useState } from 'react';

import { Play, tableMaker } from '@its/common';
import { useNavigate } from 'react-router-dom';
import Dialog from '../Dialog';
import { Loading } from '@its/components';

interface Props {
  isLeaderboard: boolean;
  data: any;
  loading: boolean;
  heading: string[];
  value: string[];
  count?: number | undefined;
  title?: string | undefined;
  page?: number | undefined;
  rowsPerPage?: number | undefined;
  handleChangePage?: (page: number) => void | undefined;
  handleChangeRowsPerPage?: (event: any) => void | undefined;
}

export default function DataTable(props: Props) {
  const { isLeaderboard, count, page, loading, rowsPerPage, title, data, heading, value, handleChangePage, handleChangeRowsPerPage } = props;
  //====================================== Hook ======================================
  const navigate = useNavigate();
  //====================================== State ======================================
  const [table, setTable] = useState<any>(undefined);
  const [row, setRow] = useState<Play | undefined>(undefined);
  //====================================== State ======================================
  useEffect(() => {
    const temp = tableMaker(heading, value, data);
    setTable(temp);
  }, [value, data, heading]);
  //====================================== State ======================================
  return (
    <div className="mt-8">
      {!loading ? (
        <>
          {!isLeaderboard && page !== undefined && count !== undefined && rowsPerPage !== undefined && (
            <h3 className="my-2.5 text-sm">
              {`${count} Bản ghi được tìm thấy. Trang ${page + 1} trên ${Math.ceil(count / rowsPerPage)}`}
            </h3>
          )}
          <div className="bg-base-100 shadow-md p-4">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    {table &&
                      table.heading.map((item: any, index: number) => (
                        <th className="bg-base-100" key={index}>{item}</th>
                      ))}
                    <th className="bg-base-100" align="right">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {table &&
                    table.body.map((items: any) => (
                      <tr key={items.id}>
                        {items.array.map((item: any, index: number) => (
                          <td key={index}>
                            {item}
                          </td>
                        ))}
                        <th align="right" key={-1}>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if (isLeaderboard) {
                                setRow(data.find((f: any) => f._id === items.id));
                              } else {
                                navigate(`/${title}/${items.id}`);
                              }
                            }}
                          >
                            XEM
                          </button>
                        </th>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="mt-2">
                {!isLeaderboard &&
                  page !== undefined &&
                  count !== undefined &&
                  rowsPerPage !== undefined &&
                  handleChangePage &&
                  handleChangeRowsPerPage && (
                    <TablePagination
                      page={page}
                      count={count}
                      rowsPerPage={rowsPerPage}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  )}
              </div>
            </div>
          </div>
          {isLeaderboard && row && (
            <Dialog open={!!row} setOpen={() => setRow(undefined)}>
              <div className='min-w-[700px]'>
                <h1 className="text-2xl font-semibold mb-5">Bình luận {row.isInterviewed ? `( ${row.interviewer} )` : ''}</h1>
                <p className="mb-5">{row.isInterviewed ? row.comment : 'Chưa được phỏng vấn'}</p>
                <div className="flex gap-2 justify-end mt-4">
                  <button className="btn btn-primary" onClick={() => setRow(undefined)}>
                    Đóng
                  </button>
                </div>
              </div>
            </Dialog>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}


interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (event: any) => void;
}

const TablePagination = (props: TablePaginationProps) => {
  const numberOfPage = Math.floor(props.count / props.rowsPerPage)
  return (
    <div>
      <select className="select select-primary focus:outline-0 h-8 min-h-0" value={props.rowsPerPage} onChange={props.handleChangeRowsPerPage}>
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </select>
      <div className="ml-4 btn-group h-8 min-h-0">
        <button
          className="btn h-8 min-h-0"
          disabled={props.page === 0}
          onClick={() => props.handleChangePage(Math.max(props.page - 1, 0))}
        >«</button>
        <button className="btn h-8 min-h-0">{props.page}</button>
        <button
          className="btn h-8 min-h-0"
          disabled={props.page === numberOfPage}
          onClick={() => props.handleChangePage(Math.min(props.page + 1, numberOfPage))}
        >»</button>
      </div>
    </div>
  )
}