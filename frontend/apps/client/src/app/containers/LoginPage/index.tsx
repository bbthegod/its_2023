/*
 *
 * LoginPage
 *
 */
import { useState, useContext } from 'react';
import { Formik, Form, useField } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { SnackbarContext, request, useAuth } from '@its/common';

const validationSchema = Yup.object().shape({
  studentCode: Yup.string()
    .required('Mã sinh viên không được để trống !')
    .matches(/^[0-9]{10}$/, 'Mã sinh viên không hợp lệ, ví dụ: 2017604482'),
  password: Yup.string().required('Mật khẩu không được để trống !'),
});

export default function LoginPage() {
  //====================================== State ======================================
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  //====================================== Hooks ======================================
  const Snackbar = useContext(SnackbarContext);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  //====================================== Callback ======================================
  const onShowPassword = () => setShowPassword(!showPassword);
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response: any = await request({
        url: '/auth/login',
        method: 'POST',
        data: {
          studentCode: values.studentCode,
          password: values.password,
        },
      });
      if (response) {
        setAuth(response, () => navigate('/'));
      } else {
        Snackbar?.open('Đăng nhập thất bại', 'error');
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        Snackbar?.open('Tài khoản hoặc mật khẩu không chính xác', 'error');
      }
      Snackbar?.open('Đăng nhập thất bại', 'error');
    }
    setLoading(false);
  };
  //====================================== Render ======================================
  return (
    <div className="p-6 grow flex flex-col justify-center items-center">
      <div className="p-6 max-w-lg w-full">
        <Formik initialValues={{ studentCode: '2017604482', password: 'spithaui' }} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ errors, touched }) => (
            <Form autoComplete="off">
              <h1 className="font-semibold text-3xl text-center mb-4">ĐĂNG NHẬP</h1>
              <div className="mb-2">
                <Input name="studentCode" type="text" label="Mã Sinh Viên" />
              </div>
              <div className="mb-2">
                <Input name="password" type={showPassword ? 'text' : 'password'} label="Mật Khẩu" />
              </div>
              <div className="flex items-center gap-2 mb-5" onClick={onShowPassword}>
                <button className="btn btn-square btn-ghost btn-xs" type="button">
                  {showPassword ? (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                <p className="text-sm font-semibold">{showPassword ? 'Ẩn' : 'Hiện'} mật khẩu</p>
              </div>
              <div className="">
                <button
                  className={`btn btn-block ${loading ? 'loading' : ''}`}
                  type="submit"
                  disabled={loading || !!errors.password || !!errors.studentCode || !touched.password || !touched.studentCode}
                >
                  ĐĂNG NHẬP
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

const Input = (props: any) => {
  const [field, meta] = useField(props.name);
  return (
    <>
      <input {...field} {...props} className={`input input-bordered ${meta.error ? 'input-error' : ''} w-full`} />
      {meta.error && meta.touched && <p className="mt-2 text-error text-xs font-semibold">{meta.error}</p>}
    </>
  );
};
