/*
 *
 * ContentDetail
 *
 */
import { detailMaker } from '@its/common';

interface Props {
  children: any;
  title: string;
  heading: string[];
  value: string[];
  data: any;
}

export default function ContentDetail({ children, title, heading, value, data }: Props) {
  return (
    <div className="flex justify-center">
      <div className='min-w-[700px] bg-base-100 shadow-md p-4'>
        <h1 className='text-lg mb-4 text-center font-bold'>{title}</h1>
        <hr />
        <div className="p-0">
          <table className="table w-full">
            <tbody>
              {detailMaker(heading, value, data).map((v: any, i: any) => (
                <tr key={i}>
                  <th>{v[0]}</th>
                  <td>{v[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <div className='flex flex-col items-start gap-2 mt-4'>
          {children}
        </div>
      </div>
    </div>
  );
}
