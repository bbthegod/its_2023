/*
 *
 * QuestionContent
 *
 */
import Timer from '../Timer';
import { PlayData, Question } from '@its/common';

interface Props {
  index: number;
  playData: PlayData;
  question: Question;
  answerQuestion: (n: number) => void;
}

export default function QuestionContent({ playData, index, question, answerQuestion }: Props) {
  return (
    <>
      <Timer time={playData.timeOut} />
      <h1 className="py-5 text-center text-2xl">
        #{index + 1}: <strong >{question.content}</strong>
      </h1>
      <div className="w-full mb-5 p-0 flex flex-col gap-1 text-center">
        {question?.options?.map(item => (
          <button
            key={item.numbering}
            className={`btn m-h-14 h-14 ${playData.questions[index].answer !== item.numbering ? 'btn-primary' : 'btn-success'}`}
            onClick={() => answerQuestion(item.numbering)}
          >
            {item.answer}
          </button>
        ))}
      </div>
    </>
  );
}
