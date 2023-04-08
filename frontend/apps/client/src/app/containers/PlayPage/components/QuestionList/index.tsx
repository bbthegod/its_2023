/*
 *
 * QuestionList
 *
 */
import { PlayData } from '@its/common';

interface Props {
  index: number;
  playData: PlayData;
  selectQuestion: (i: number) => void;
}

export default function QuestionList({ playData, index, selectQuestion }: Props) {
  return (
    <div className='w-full grid grid-cols-4 gap-2'>
      {playData?.questions?.map((item, idx) => (
        <button
          className={`btn btn-${item.answered || idx === index ? "success": "primary"} w-full min-h-[40px] h-10`}
          onClick={() => selectQuestion(idx)}
          key={item._id}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}
