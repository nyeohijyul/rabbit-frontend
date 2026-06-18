import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './Timer.css'

import rabbit_cheeringImg from '../assets/rabbit_cheering.png';
import rabbit_restingImg from '../assets/rabbit_resting.png';
import rabbit_worriedImg from '../assets/worried Rabbit.png';
import carrotImg from '../assets/carrot.png';

import backSvg from '../assets/back.svg'
import changetimeSvg from '../assets/changetime.svg'
import startSvg from '../assets/start2.svg'
import resetSvg from '../assets/reset.svg'
import pauseSvg from '../assets/pause.svg'
import timerSvg from '../assets/timer.svg'

const BASE_URL = "http://15.164.93.68:8080";

const url = `${BASE_URL}/rest/skip`;

const backendAPI = {
  postRestSkip: async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ contentType, timerLength }),
      body: JSON.stringify({}),
    });
    const data = await response.json();
    return data;
  }
}

function Header({ text }) {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => {navigate('/home')}}>
        <img src={backSvg}/>
      </button>
      <p className='semibold'>{text}</p>
    </>
  )
}

function SvgButton({ svgsrc, text, onClick, img }) {
  return (
    <>
      <button onClick={onClick}>
        <img src={svgsrc} width={img.w} height={img.h} style={{ marginRight: '5px' }} />
        {text}
      </button>
    </>
  )
}

function TimerChart({ timerLength = 10, onClick, isRunning, setIsRunning, setShowPopup, autostart=false }) {
  const size = 265;
  const stroke = 19.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [timeLeft, setTimeLeft] = useState(timerLength*60);

  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    setTimeLeft(timerLength*60)
  }, [timerLength])

  // 시작 / 재시작
  const start = () => {
    if (isRunning) return;

    setIsRunning(true);

    const now = Date.now();
    endTimeRef.current = now + timeLeft * 1000;

    intervalRef.current = setInterval(() => {
      const diff = Math.max(0, endTimeRef.current - Date.now());
      const seconds = Math.ceil(diff / 1000);

      setTimeLeft(seconds);

      if (seconds <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setShowPopup(true);
      }
    }, 200);
  };
  if (autostart) start();

  // 일시정지
  const pause = () => {
    if (!isRunning) return;

    clearInterval(intervalRef.current);
    setIsRunning(false);

    // 남은 시간 고정
    const diff = Math.max(0, endTimeRef.current - Date.now());
    setTimeLeft(Math.ceil(diff / 1000));
  };

  // 리셋 (선택)
  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(timerLength*60);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // 진행률
  const progress = timeLeft / (timerLength*60);

  const offset = circumference * (1 - progress);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m} : ${s}`;
  };

  return (
    <>
      <div className='timer-chart'>
        <svg width={size} height={size}>
          {/* 배경 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FEECDB"
            strokeWidth={stroke}
            fill="none"
          />

          {/* 진행 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FE9957"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />
        </svg>

        {/* 중앙 텍스트 */}
        <div className='timer-center-text'>
          <p className='medium'>{!isRunning ? '타이머' : '휴식 중이에요!'}</p>
          <p className='medium'>{formatTime(timeLeft)}</p>
          <p>{!isRunning ? '시작을 눌러주세요.' : '남은 시간' }</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className='timer-buttons'>
        {!isRunning && (
          <>
            <SvgButton onClick={onClick} svgsrc={changetimeSvg} img={{w:16, h:19.5}} text="시간변경" />
            <SvgButton onClick={start} svgsrc={startSvg} img={{w:16, h:21}} text="시작" />
          </>
        )}
        {isRunning && (
          <>
            <SvgButton onClick={reset} svgsrc={resetSvg} img={{w:16, h:18.38}} text="재실행" />
            <SvgButton onClick={pause} svgsrc={pauseSvg} img={{w:18, h:18}} text="일시정지" />
          </>
        )}
        {/* <button onClick={start}>시작 / 재개</button>
        <button onClick={pause}>일시정지</button>
        <button onClick={reset}>리셋</button> */}
      </div>
    </>
  );
}

function TimerInputButtons({ timerLength, setTimerLength }) {
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = () => {
    setIsEditing(false);
  };

  return (
    <>
      {[10,20,30].map((min, i) => (
        <button key={i} onClick={ () => setTimerLength(min) }>
          {`${min}분`}
        </button>
      ))}
      
      {/* <button onClick={ () => {} }>직접 설정</button> */}
      {/* <button><input placeholder='직접 설정' type="number" step="1" onChange={ (e) => setTimerLength(Number(e.target.value)) } /></button> */}
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>직접 설정</button>
      ) : (
        <input
          className='input-button'
          autoFocus
          onChange={(e) => {
            if (Number.isNaN(Number(e.target.value))) {
              e.target.value='';
              setTimerLength('')
            } else {
              setTimerLength(e.target.value)
            }
          }}
          onBlur={handleSubmit}
        />
      )}
    </>
  )
}

function ComputedTime({ min }) {
  const sec = min * 60;
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return (
    <p><span>{m}</span>분 <span>{s}</span>초</p>
  )
}

function ImgButton({ src, text, onClick }) {
  return (
    <>
      <img onClick={onClick} width={80} src={src} style={{ position: 'absolute', top: -5, right: 20 }} />
      <button onClick={onClick}>
        <p className='semibold' style={{ fontSize: '18px' }}>{text}</p>
      </button>
    </>
  )
}

function TimerPopup({ contentType, timerLength, setShowPopup, setIsAutostart }) {
  const navigate = useNavigate();
  return (
    <div className='timer-popup-container'>
      <div className='timer-popup'>
        <div className='timer-popup-wrapper'>
          <img src={timerSvg} width={31} height={38}/>
          <p className='semibold'>{timerLength}분째 {contentType}를 보고있어요</p>
          <p style={{fontWeight:'bold'}}>잠시 쉬어가는 건 어떨까요?</p>
          <img src={rabbit_restingImg} height={241}/>
          <div className='timer-info'>
            <div>
              <p>설정한 휴식 시간</p>
              <ComputedTime min={timerLength} />
            </div>
            <img src={carrotImg} width={85}/>
            <div>
              <p>미션 시 획득 당근</p>
              <p><span>+1</span>개</p>
            </div>
          </div>
          <div className='timer-popup-button orangebtn'>
            <ImgButton
              src={rabbit_cheeringImg}
              text='쉬어가기 (미션 수행)'
              onClick={() => {
                navigate('/mission', {
                  state: {
                    timerLength: timerLength,
                    contentType: contentType
                  }
                })
              }}
            />
          </div>
          <div className='timer-popup-button whitebtn'>
            <ImgButton
              src={rabbit_worriedImg}
              text='나중에 할게요'
              onClick={()=>{
                backendAPI.postRestSkip();
                setIsAutostart(true);
                setShowPopup(false)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Timer({ timer_id, started_at=Date.now() }) {
  const [contentType, setContentType] = useState('');
  const [timerLength, setTimerLength] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isAutostart, setIsAutostart] = useState(false);
  const locate = useLocation();

  useEffect(() => {
    if (locate.state) {
      setTimerLength(locate.state['timerLength']);
      setContentType(locate.state['contentType']);
    } else {
      navigate('/start')
    }
  }, [])

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";
    document.head.appendChild(link);
  }, []);

  const navigate = useNavigate();
  
  return (
    <>
      {!showPopup ?
      <div className='timer-container'>
        <div className='timer-header'>
          <Header text={'콘텐츠 이용 시간'} />
        </div>
        <div className='timer-contentType'>
          <p className='medium'>{contentType + ' / ' + timerLength+ '분 휴식 주기'}</p>
        </div>
        <div className='timer'>
          <TimerChart timerLength={timerLength} onClick={() => setShowSetting(!showSetting)} isRunning={isRunning} setIsRunning={setIsRunning} setShowPopup={setShowPopup} autostart={isAutostart} />
        </div>
        {!isRunning && showSetting && <div className="timer-form">
          <p className='semibold'>시간 설정</p>
          <div className="timer-input">
            <TimerInputButtons setTimerLength={setTimerLength}/>
          </div>
        </div>}
        <div className="timer-rest-info">
          <img src={carrotImg} width={85} />
          <div className="timer-rest">
            <p>지금까지 휴식 시간</p>
            <p><span>40</span>분 <span>12</span>초</p>
          </div>
          <div className="earned-carrots">
            <p>오늘 성공</p>
            <p><span>3</span>회</p>
          </div>
        </div>
      </div>
      : <TimerPopup contentType={contentType} timerLength={timerLength} setShowPopup={setShowPopup} setIsAutostart={setIsAutostart}/>}
    </>
  )
}

export default Timer;