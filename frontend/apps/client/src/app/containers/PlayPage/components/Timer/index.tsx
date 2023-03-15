/*
 *
 * Timer
 *
 */
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Props {
  time: any;
}

function format(time: number) {
  let seconds: number = +Math.floor(time % 60);
  let minutes: number = +Math.floor(time / 60);
  minutes = minutes.toString().length === 1 ? +`0${minutes}` : minutes;
  seconds = seconds.toString().length === 1 ? +`0${seconds}` : seconds;
  // return `${minutes}:${seconds}`;
  return [minutes, seconds];
}

export default function Timer({ time }: Props) {
  //====================================== State ======================================
  const [currentTime, setCurrentTime] = useState(Math.floor((new Date(time).getTime() - new Date(Date.now()).getTime()) / 1000));
  //====================================== Hooks ======================================
  const navigate = useNavigate();
  //====================================== Effect ======================================
  useEffect(() => {
    setCurrentTime(Math.floor((new Date(time).getTime() - new Date(Date.now()).getTime()) / 1000));
    if (currentTime <= 0) navigate('/ended');
    const inter = setInterval(() => {
      setCurrentTime(Math.floor((new Date(time).getTime() - new Date(Date.now()).getTime()) / 1000));
    }, 1000);
    return () => {
      clearInterval(inter);
    };
  }, [currentTime, navigate, time]);
  
  const fmt = format(currentTime)
  //====================================== Render ======================================
  return (
    <div className="w-1/2 px-4 py-2 bg-primary mx-auto flex justify-center">
      <span className="countdown font-mono text-[20px] text-[#FFF] font-bold">
        <span style={{ "--value": Math.min(fmt[0], 59) } as React.CSSProperties} />:
        <span style={{ "--value": fmt[1] } as React.CSSProperties} />
      </span>
    </div>
  );
}
