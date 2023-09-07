/*
 *
 * Header
 *
 */
interface Props {
  title: string;
  subtitle: string;
  setOpen?: (v: any) => void;
}

export default function Header({ setOpen, title, subtitle }: Props) {
  return (
    <div className="w-full flex flex-wrap md:flex-row gap-4">
      <div className="grow">
        <h2 className="text-white text-sm mb-2 w-fit">{subtitle}</h2>
        <h1 className="text-white text-5xl mb-2 w-fit">{title}</h1>
      </div>
      <div className="flex items-center">
        {setOpen && (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Tạo Mới
          </button>
        )}
      </div>
    </div>
  );
}
