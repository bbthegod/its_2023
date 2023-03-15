/*
 *
 * Play
 *
 */
interface Props {
  play: any;
}

export default function Play({ play }: Props) {
  return play ? (
    <>
      <div className="bg-base-100 shadow-md grid grid-cols-4">
        <div className="p-2.5 text-center">
          <h4 className="text-sm mb-2">Mã Sinh Viên</h4>
          <h6 className="text-xl font-semibold">{play.userId.studentCode}</h6>
        </div>
        <div className="p-2.5 text-center">
          <h4 className="text-sm mb-2">Tổng điểm</h4>
          <h6 className="text-xl font-semibold">{play.playScore}</h6>
        </div>
        <div className="p-2.5 text-center">
          <h4 className="text-sm mb-2">Thời gian kết thúc</h4>
          <h6 className="text-xl font-semibold">{play.timeOut ? new Date(play.timeOut).toLocaleString() : ""}</h6>
        </div>
        <div className="p-2.5 text-center">
          <h4 className="text-sm mb-2">Đã Phỏng vấn</h4>
          <h6 className="text-xl font-semibold flex justify-center">
            {play.isInterviewed ? (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </h6>
        </div>
      </div>
      <div className="mt-4 bg-base-100 shadow-md p-4">
        <h1 className='text-lg mb-4 text-center font-bold'>Câu Hỏi</h1>
        <hr />
        <div className="p-0">
          <div className="min-w-[700px]">
            <table className="table w-full ">
              <thead>
                <tr>
                  <th align="left" className='bg-base-100'>Câu Trả Lời</th>
                  <th align="left" className='bg-base-100'>Số Thứ Tự</th>
                  <th align="center" className='bg-base-100'>Đã Trả Lời</th>
                </tr>
              </thead>
              <tbody>
                {play.questions.map((question: any, index: any) => (
                  <tr key={question._id}>
                    <td align="left">{question.questionId.content}</td>
                    <td align="left">{question.answered ? question.questionId.options[question.answer - 1].answer : 'Chưa trả lời'}</td>
                    <td align="center">
                      {question.answered ? (
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <h1 className="text-white">
      Chưa dự thi
    </h1>
  );
}
