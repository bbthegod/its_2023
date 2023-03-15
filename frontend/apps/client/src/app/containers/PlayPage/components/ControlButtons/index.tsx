/*
 *
 * ControlButtons
 *
 */
interface Props {
  next: () => void;
  previous: () => void;
  end: () => void;
  disabledPrev: boolean;
  disabledNext: boolean;
}

export default function ControlButtons({ previous, next, end, disabledPrev, disabledNext }: Props) {
  return (
    <div className="flex justify-between">
      <button
        className="btn btn-square btn-sm"
        onClick={previous}
        disabled={disabledPrev}
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        className="btn btn-square btn-sm"
        onClick={() => {
          if (window.confirm("Bạn có muốn kết thúc vòng chơi ?")) {
            end()
          }
        }}
        style={{ display: disabledNext ? '' : 'none' }}
        disabled={disabledPrev}
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      </button>
      <button
        className="btn btn-square btn-sm"
        onClick={next}
        disabled={disabledNext}
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
