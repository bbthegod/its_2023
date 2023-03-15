/*
 *
 * Select
 *
 */
import { useField } from "formik";

export default function Select(props: any) {
  const [field, meta] = useField(props.name);
  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <select {...field} {...props} className={`select select-bordered ${meta.error ? "input-error" : ""} w-full`}>
        {props.children}
      </select>
      {meta.error && meta.touched && <p className='mt-2 text-error text-xs font-semibold'>{meta.error}</p>}
    </div>
  )
}
