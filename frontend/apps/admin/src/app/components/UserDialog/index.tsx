/*
 *
 * UserDialog
 *
 */
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { request, stringNormalize, User, USER_URL } from '@its/common';
import Dialog from '../Dialog';
import TextField from '../TextField';

interface Props {
  data?: User;
  open: boolean;
  setOpen: (v: boolean) => void;
  handleSubmit: (v: any) => void;
}

const validationSchema = Yup.object().shape({
  studentCode: Yup.number()
    .min(2017000000, 'Mã sinh viên không hợp lệ !')
    .max(2022999999, 'Mã sinh viên không hợp lệ !')
    .required('Trường này không được để trống !'),
  studentName: Yup.string().required('Trường này không được để trống !'),
  studentClass: Yup.string()
    .required('Trường này không được để trống !')
    .matches(/[A-Z]{4}[0-9]-[K][1][0-9]/, 'Lớp-Khoá không hợp lệ, ví dụ: HTTT1-K12'),
  studentPhone: Yup.string()
    .required('Trường này không được để trống !')
    .matches(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Số điện thoại không hợp lệ !'),
  password: Yup.string().required('Trường này không được để trống !'),
});

const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export default function UserDialog({ open, setOpen, data, handleSubmit }: Props) {
  //====================================== Callback ======================================
  const onSubmit = async (values: any, actions: any) => {
    values.studentName = stringNormalize(values.studentName);
    values.studentCode = `${values.studentCode}`
    if(data) {
      handleSubmit({
        ...data,
        ...values,
        ...{ password: values.password === "******" ? "" : values.password }
      });
      setOpen(false);
    } else {
      const { response } = await request({
        url: `${USER_URL}?limit=5&skip=0&search=${values.studentCode}`,
        method: 'GET',
      });
      if (response && response.count > 0) {
        actions.setSubmitting(false);
        actions.setFieldError('studentCode', 'Mã sinh viên đã được sử dụng');
      } else {
        handleSubmit(values);
        setOpen(false);
      }
    }
  };
  //====================================== Render ======================================
  return (
    <Dialog setOpen={setOpen} open={open}>
      <div className=''>
        <Formik
          initialValues={{
            studentCode: data ? data.studentCode : '',
            studentName: data ? data.studentName : '',
            studentClass: data ? data.studentClass : '',
            studentPhone: data ? data.studentPhone : '',
            password: data ? "******" : `${getRndInteger(100000, 999999)}`,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form autoComplete="off">
              <div className='w-[700px]'>
                <div>
                  <h4 className="text-3xl text-center font-bold">
                    {data ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
                  </h4>
                  <div className="mt-2.5 grid grid-cols-2 gap-4">
                    <div>
                      <TextField
                        name="studentCode"
                        label="Mã sinh viên"
                        type="number"
                      />
                    </div>
                    <div>
                      <TextField
                        name="studentName"
                        label="Tên sinh viên"
                        type="text"
                      />
                    </div>
                    <div>
                      <TextField
                        name="studentClass"
                        label="Lớp-Khoá"
                        type="text"
                      />
                    </div>
                    <div>
                      <TextField
                        name="studentPhone"
                        label="Số điện thoại"
                        type="text"
                      />
                    </div>
                    <div className="col-span-2 flex gap-2 items-end">
                      <TextField
                        name="password"
                        label="Mật khẩu"
                        type="text"
                        disabled
                      />
                      <button
                        className="btn btn-square"
                        type="button"
                        onClick={() => {
                          setFieldValue("password", getRndInteger(100000, 999999).toString())
                        }}
                      >
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                  <button className="btn btn-ghost" type="button" onClick={() => setOpen(false)}>
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
      </div>
    </Dialog>
  )
}
