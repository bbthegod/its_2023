/*
 *
 * UserDetail
 *
 */
import { useState } from 'react';
import { Play } from '@its/common';

interface Props {
  usersDetail: Play;
  handleSubmit: any;
}

export default function UserDetail({ usersDetail, handleSubmit }: Props) {
  //====================================== State ======================================
  const [attitudeScore, setAttitudeScore] = useState(0);
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [comment, setComment] = useState('');
  //====================================== Callback ======================================
  const onSubmit = () => {
    handleSubmit(attitudeScore, knowledgeScore, comment);
    setAttitudeScore(0);
    setKnowledgeScore(0);
    setComment('');
  };
  //====================================== Render ======================================
  return (
    <div className="">
      <div className="flex gap-4 py-4 px-2">
        <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#FFF] !m-0 !p-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
        </div>

        <div>
          <h3 className="text-base font-semibold">{usersDetail?.userId?.studentCode}</h3>
          <h4 className="text-sm">Mã Sinh Viên</h4>
        </div>
      </div>
      <div className="flex gap-4 py-4 px-2">
        <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#FFF] !m-0 !p-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-base font-semibold">Họ Tên</h3>
          <h4 className="text-sm">{usersDetail?.userId?.studentName}</h4>
        </div>
      </div>

      <div className="flex gap-4 py-4 px-2">
        <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#FFF] !m-0 !p-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-base font-semibold">Lớp</h3>
          <h4 className="text-sm">{usersDetail?.userId?.studentClass}</h4>
        </div>
      </div>

      <div className="flex gap-4 py-4 px-2">
        <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#FFF] !m-0 !p-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-base font-semibold">Số Điện Thoại</h3>
          <h4 className="text-sm">{usersDetail?.userId?.studentPhone}</h4>
        </div>
      </div>

      <div className="flex gap-4 py-4 px-2">
        <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#FFF] !m-0 !p-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-base font-semibold">Điểm Bài Thi</h3>
          <h4 className="text-sm">{usersDetail?.playScore}</h4>
        </div>
      </div>

      <div className="text-left flex flex-col items-center">
        <div className="form-control w-full mt-4">
          <label className="label p-0 m-0 text-sm mb-2">Thái Độ</label>
          <input
            type="range"
            step={10}
            min={0}
            max={100}
            className="range"
            value={attitudeScore}
            onChange={(e: any) => setAttitudeScore(e.target?.value)}
          />
          <span className="mt-2 text-end text-sm font-bold">{attitudeScore}</span>
        </div>

        <div className="form-control w-full mt-4">
          <label className="label p-0 m-0 text-sm mb-2">Kiến Thức</label>
          <input
            type="range"
            step={10}
            min={0}
            max={100}
            className="range"
            value={knowledgeScore}
            onChange={(e: any) => setKnowledgeScore(e.target?.value)}
          />
          <span className="mt-2 text-end text-sm font-bold">{knowledgeScore}</span>
        </div>

        <div className="form-control w-full mt-4">
          <label className="label p-0 m-0 text-sm mb-2">Ghi chú</label>
          <textarea
            className="textarea textarea-bordered !min-w-full w-full min-h-[200px] p-4"
            placeholder="Ghi chú"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        
        <button className="btn btn-primary mt-4" onClick={onSubmit}>
          Gửi đi
        </button>
      </div>
    </div>
  );
}
