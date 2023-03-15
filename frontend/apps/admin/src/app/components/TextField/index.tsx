/*
 *
 * TextField
 *
 */
import { useField } from "formik";

export default function TextField(props: any) {
  const [field, meta] = useField(props.name);
  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <input {...field} {...props} className={`input input-bordered ${meta.error ? "input-error" : ""} w-full`} />
      {meta.error && meta.touched && <p className='mt-2 text-error text-xs font-semibold'>{meta.error}</p>}
    </div>
  )
}