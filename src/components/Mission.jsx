import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './Mission.css';
import rabbit_healthyImg from '../assets/rabbit_healthy.png';
import rabbit_worriedImg from '../assets/worried Rabbit.png';
import backSvg from '../assets/back.svg'

const BASE_URL = "http://15.164.93.68:8080";

const backendAPI = {
  postRestSuccess: async (user_id, timer_id, is_correct=true) => {
    console.log({
        user_id, timer_id, is_correct
      })
    const response = await fetch(`${BASE_URL}/rest/success`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id, timer_id, is_correct
      }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }
}

function Header({ text }) {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('/home')}>
        <img src={backSvg}/>
      </button>
      <p className='semibold'>{text}</p>
    </>
  )
}

function randomMission() {
  let index = Math.floor(Math.random()*2);
  switch (index) {
    case 0: {
      let num1 = Math.floor(Math.random() * 20) + 1;
      let num2 = Math.floor(Math.random() * 20) + 1;
      return {
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2
      };
    }
    case 1: {
      let num1 = Math.floor(Math.random() * 8) + 2;
      let num2 = Math.floor(Math.random() * 8) + 2;
      return {
        question: `${num1} × ${num2} = ?`,
        answer: num1 * num2
      };
    }
    default:
      return;
  }
}

function Mission() {
  const [contentType, setContentType] = useState('');
  const [timerLength, setTimerLength] = useState(600);
  const [timerId, setTimerId] = useState('');

  const [selectedMission, setSelectedMission] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [missionData, setMissionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  
  const navigate = useNavigate();
  const locate = useLocation();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) navigate('/');
    if (locate.state) {
      setTimerLength(locate.state['timerLength']);
      setContentType(locate.state['contentType']);
      setTimerId(locate.state['timerId']);
    } else {
      navigate('/start')
    }
    setMissionData(randomMission());
  }, [])

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";
    document.head.appendChild(link);
  }, []);

  const checkAnswer = async () => {
    setShowResult(true);
    if (Number(userAnswer) === missionData.answer) backendAPI.postRestSuccess(userId, timerId);
  }

  return (
    <>
      <div className="mission-container">
        <header className="mission-header">
          <Header text='쉬어가기 미션' />
        </header>
        <section className="mission-content">
          {!showResult && (
            <>
              <p style={{fontWeight:'bold'}}>문제를 맞히면<br />당근을 받을 수 있어요!</p>
              <div className="mission-card">
                <p className='semibold'>MISSION</p>
                <p className='semibold'>{missionData?.question}</p>
                <input
                  type="text"
                  placeholder="답을 입력해주세요"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {if (e.key == "Enter") checkAnswer()}}
                />
              </div>
              <button onClick={checkAnswer}>확인하기</button>
            </>
          )}
          {showResult && (Number(userAnswer) === missionData.answer ?
            <>
              <p className="comment" style={{fontWeight:'bold'}}>정답이에요!</p>
              <img src={rabbit_healthyImg} height={235}/>
              <div className="comments">
                <p className='semibold'>당근을 획득했어요!</p>
                <p>이번 휴식도 성공이에요!</p>
              </div>
              <button onClick={() => navigate('/success', {
                state: {
                  timerLength: timerLength,
                  contentType: contentType
                },
              })}>다음</button>
            </>
          :
            <>
              <p className="comment" style={{fontWeight:'bold'}}>아쉬워요! 😢</p>
              <img src={rabbit_worriedImg} height={235}/>
              <div className="comments">
                <p>한 번 더 도전해볼까요?</p>
              </div>
              <button onClick={() => {
                setShowResult(false);
                setUserAnswer('');
              }}>다시 풀기</button>
            </>
          )}
        </section>
      </div>
    </>
  )
}

export default Mission;