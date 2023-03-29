/*
 *
 * QuestionDialog
 *
 */
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Dialog from '../Dialog';
import TextField from '../TextField';
import Select from '../Select';

interface Props {
  data?: any;
  open: boolean;
  setOpen: any;
  handleSubmit: any;
}

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Trường này không được để trống !'),
  answer1: Yup.string().required('Trường này không được để trống !'),
  answer2: Yup.string().required('Trường này không được để trống !'),
  answer3: Yup.string().required('Trường này không được để trống !'),
  answer4: Yup.string().required('Trường này không được để trống !'),
  correctAnswer: Yup.string().required('Trường này không được để trống !'),
});

export default function QuestionDialog({ open, setOpen, data, handleSubmit }: Props) {
  //====================================== Callback ======================================
  const onSubmit = (values: any) => {
    if (data) {
      handleSubmit({
        ...data,
        ...{ content: values.content },
        ...{ correctAnswer: +values.correctAnswer },
        ...{ level: values.level },
        ...{
          options: [
            { numbering: 1, answer: values.answer1 },
            { numbering: 2, answer: values.answer2 },
            { numbering: 3, answer: values.answer3 },
            { numbering: 4, answer: values.answer4 },
          ],
        },
      });
    } else {
      handleSubmit({
        ...{ content: values.content },
        ...{ correctAnswer: +values.correctAnswer },
        ...{ level: values.level },
        ...{
          options: [
            { numbering: 1, answer: values.answer1 },
            { numbering: 2, answer: values.answer2 },
            { numbering: 3, answer: values.answer3 },
            { numbering: 4, answer: values.answer4 },
          ],
        },
      });
    }
    setOpen(false);
  };
  //====================================== Render ======================================
  return (
    <Dialog setOpen={setOpen} open={open}>
      <Formik
        initialValues={{
          content: data ? data.content : '',
          answer1: data ? data.options[0].answer : '',
          answer2: data ? data.options[1].answer : '',
          answer3: data ? data.options[2].answer : '',
          answer4: data ? data.options[3].answer : '',
          correctAnswer: data ? data.correctAnswer : '',
          level: data ? data.level : 'easy',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values }) => (
          <Form>
            <div className='w-[700px]'>
              <div>
                <h4 className="text-3xl text-center font-bold">
                  {data ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'}
                </h4>
                <div className="mt-2.5 grid grid-cols-2 gap-4">
                  <div>
                    <TextField
                      name="content"
                      label="Nội Dung"
                      type="text"
                    />
                  </div>
                  <div>
                    <Select
                      name="level"
                      label="Độ Khó"
                    >
                      <option value="easy">Dễ</option>
                      <option value="medium">Trung Bình</option>
                      <option value="hard">Khó</option>
                    </Select>
                  </div>
                  <div>
                    <TextField
                      name="answer1"
                      label="Câu Trả Lời 1"
                      type="text"
                    />
                  </div>
                  <div>
                    <TextField
                      name="answer2"
                      label="Câu Trả Lời 2"
                      type="text"
                    />
                  </div>
                  <div>
                    <TextField
                      name="answer3"
                      label="Câu Trả Lời 3"
                      type="text"
                    />
                  </div>
                  <div>
                    <TextField
                      name="answer4"
                      label="Câu Trả Lời 4"
                      type="text"
                    />
                  </div>
                  <div className="col-span-2"> 
                    <Select
                      name="correctAnswer"
                      label="Câu trả lời đúng"
                    >
                      <option value={1}>{values.answer1}</option>
                      <option value={2}>{values.answer2}</option>
                      <option value={3}>{values.answer3}</option>
                      <option value={4}>{values.answer4}</option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                  Đóng
                </button>
                <button className="btn btn-primary" type="submit" color="primary">
                  Lưu
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
