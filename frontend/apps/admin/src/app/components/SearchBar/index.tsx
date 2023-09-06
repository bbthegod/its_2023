/*
 *
 * SearchBar
 *
 */
import { useEffect, useState } from 'react';
interface Props {
  search: string;
  setSearch: any;
}

const useDebounce = (value: string, timeout: number) => {
  const [state, setState] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout);
    return () => clearTimeout(handler);
  }, [value, timeout]);
  return state;
};

export default function SearchBar({ search, setSearch }: Props) {
  const [s, setS] = useState(search);
  const v = useDebounce(s, 1000);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setS(e.target.value);
  }

  useEffect(() => {
    setSearch(v);
  }, [setSearch, v]);

  return (
    <div className="mt-6">
      <div className="py-2 px-4 w-fit gap-4 flex items-center w-1/4 bg-base-100 shadow-md overflow-hidden">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="shrink-0 w-5 h-5 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        <input className="h-6 color-primary grow border-0 focus-visible:outline-0" value={s} onChange={handleChange} />
      </div>
    </div>
  );
}
