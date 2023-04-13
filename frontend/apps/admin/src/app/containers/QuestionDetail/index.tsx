/*
 *
 * QuestionDetail
 *
 */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Question, SnackbarContext } from '@its/common';
import { mutation, query } from '../../services/admin';

import ConfirmDialog from '../../components/ConfirmDialog';
import ContentDetail from '../../components/ContentDetail';
import QuestionDialog from '../../components/QuestionDialog';
import Header from '../../components/Header';

const heading = ['Nội dung', 'Độ Khó', 'Câu trả lời 1', 'Câu trả lời 2', 'Câu trả lời 3', 'Câu trả lời 4', 'Câu trả lời đúng'];
const value = ['content', 'level', 'options[0].answer', 'options[1].answer', 'options[2].answer', 'options[3].answer', 'correctAnswer'];

export default function QuestionDetail() {
  //====================================== Hook ======================================
  const navigate = useNavigate();
  const { id } = useParams();
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [removeDialog, setRemoveDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [question, setQuestion] = useState<Question>();
  //====================================== Callback ======================================
  const getQuestion = useCallback(() => {
    query(`/question/${id}`)
      .then((data: any) => {
        if (data) setQuestion(data.data);
      })
      .catch(() => {
        Snackbar?.open('Lấy dữ liệu thất bại', 'error');
      });
  }, [Snackbar, id]);

  const handleRemove = () => {
    mutation(`/question/${id}`, null, 'DELETE')
      .then(() => {
        Snackbar?.open('Xoá câu hỏi thành công', 'success');
        navigate('/question');
      })
      .catch(() => {
        Snackbar?.open('Xoá câu hỏi thất bại', 'error');
        navigate('/question');
      });
  };

  const handleSubmit = (data: any) => {
    mutation(`/question/${id}`, data, 'PUT')
      .then(() => {
        Snackbar?.open('Cập nhật câu hỏi thành công', 'success');
        navigate('/question');
      })
      .catch(() => {
        Snackbar?.open('Cập nhật câu hỏi thất bại', 'error');
        navigate('/question');
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    if (id) {
      getQuestion();
    }
  }, [Snackbar, getQuestion, id]);
  //====================================== Render ======================================
  if (!question) return null;
  return (
    <div>
      <Header subtitle="Câu Hỏi" title={question ? question.content : ''} />
      <div className="tabs mt-6">
        <a className="tab tab-bordered tab-active">CÂU HỎI</a>
      </div>
      <div className="mt-6">
        {question && (
          <ContentDetail title="Thông tin câu hỏi" heading={heading} value={value} data={question}>
            <button onClick={() => setEditDialog(true)} className="text-[#2196f3] btn btn-ghost btn-sm">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
              Sửa
            </button>
            <button onClick={() => setRemoveDialog(true)} className="text-[#f44336] btn btn-ghost btn-sm">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Xoá
            </button>
          </ContentDetail>
        )}
      </div>
      <ConfirmDialog open={removeDialog} setOpen={setRemoveDialog} message="Xoá câu hỏi này ?" handleAction={handleRemove} />
      {question && <QuestionDialog data={question} setOpen={setEditDialog} open={editDialog} handleSubmit={handleSubmit} />}
    </div>
  );
}
