/*
 *
 * PlayPage
 *
 */
import { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { SnackbarContext, SOCKET_URL, request, useAuth, PlayData, Question } from '@its/common';
import { Loading } from '@its/components';

import QuestionContent from './components/QuestionContent';
import ControlButtons from './components/ControlButtons';
import QuestionList from './components/QuestionList';

export default function PlayPage() {
  //====================================== Hooks ======================================
  const { auth } = useAuth();
  const navigate = useNavigate();
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [index, setIndex] = useState(0);
  const [playData, setPlayData] = useState<PlayData>();
  const [question, setQuestion] = useState<Question>();
  //====================================== Const ======================================
  const token = useMemo(() => auth?.token, [auth]);
  const socket = useMemo(() => new WebSocket(SOCKET_URL), []);
  //====================================== Callback ======================================
  //Previous question
  const previous = () => {
    if (index > 0) setIndex(index - 1);
  };

  //Next question
  const next = () => {
    if (playData && index < playData.questions.length - 1) setIndex(index + 1);
  };

  //End play
  const end = async () => {
    try {
      const { response } = await request({
        url: `/play/end`,
        method: 'GET',
      });
      if (response && response.data) {
        socket.send(JSON.stringify({ type: 'disconnect', token }));
        socket.close();
        navigate('/ended');
      } else {
        Snackbar?.open('Có lỗi xảy ra', 'error');
      }
    } catch (error) {
      Snackbar?.open('Có lỗi xảy ra', 'error');
    }
  };

  //Select question
  const selectQuestion = (idx: number) => setIndex(idx);

  //Anwser a question and send it through socket
  const answerQuestion = (numbering: number) => {
    if (numbering) {
      socket.send(JSON.stringify({ type: 'question', data: { index, answer: numbering }, token }));
      const oldState = JSON.parse(JSON.stringify(playData));
      if (oldState) {
        oldState.questions[index].answer = numbering;
        oldState.questions[index].answered = true;
        setPlayData(oldState);
      }
    }
  };
  //====================================== Effect ======================================
  //Login into socket and get data in the first time render
  useEffect(() => {
    const getPlay = async () => {
      try {
        const { response } = await request({
          url: `/play/get`,
          method: 'GET',
        });
        if (response && response.data) {
          const data = response.data
          if (data && data.timeOut) {
            setPlayData(data);
            setQuestion(data.questions[index].questionId);
            //Checking time out of current play session
            if (new Date(data.timeOut).getTime() - new Date(Date.now()).getTime() <= 0) {
              socket.send(JSON.stringify({ type: 'disconnect', token }));
              socket.close();
              navigate('/ended');
            }
          }
        } else {
          Snackbar?.open('Có lỗi xảy ra', 'error');
        }
      } catch (error) {
        Snackbar?.open('Có lỗi xảy ra', 'error');
      }
    };
    getPlay();
    return () => {
      if(socket.readyState === socket.OPEN){
        socket.send(JSON.stringify({ type: 'disconnect', token }));
        socket.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //====================================== Socket ======================================
  socket.onopen = function(event) {
    setTimeout(() => socket.send(JSON.stringify({ type: 'login', token })), 100)
  };

  socket.onmessage = function(event) {
    console.log("[message] Data received from server: "+ event.data);
  };
  
  socket.onclose = function(event) {
    console.log('[close] Connection died');
  };
  
  socket.onerror = function(error) {
    console.log("[error]");
  };
  //====================================== Render ======================================
  return playData && question ? (
    <div className="mt-4 px-4 flex flex-col gap-6">
      <div className="w-full">
        <QuestionContent question={question} playData={playData} index={index} answerQuestion={answerQuestion} />
        <ControlButtons
          end={end}
          next={next}
          previous={previous}
          disabledPrev={index === 0}
          disabledNext={index === playData?.questions?.length - 1}
        />
      </div>
      <button onClick={() => socket.send("JSON.stringify({ type: 'login', token })")}>ádsadasd</button>
      <QuestionList playData={playData} selectQuestion={selectQuestion} />
    </div>
  ) : (
    <Loading />
  );
}
