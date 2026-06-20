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

const backendAPI = {
  postRestSkip: async (userId) => {
    const response = await fetch(`${BASE_URL}/rest/skip?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data)
    return data;
  },
  getUserSuccessCount: async (userId) => {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/stats`
    );
    const data = await response.json();
    return data.success_count;
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
        <img
          src={svgsrc}
          width={img.w}
          height={img.h}
          style={{ marginRight: '5px' }}
        />
        {text}
      </button>
    </>
  )
}

function TimerChart({ timerLength = 600, onClick, isRunning, setIsRunning, setShowPopup, autostart=false }) {
  const size = 265;
  const stroke = 19.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [timeLeft, setTimeLeft] = useState(timerLength);

  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    setTimeLeft(timerLength)
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
    setTimeLeft(timerLength);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // 진행률
  const progress = timeLeft / (timerLength);

  const offset = circumference * (1 - progress);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = String(Math.floor((sec - h*3600) / 60)).padStart(2, "0");
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    if (h) {
      return `${String(h).padStart(2, "0")} : ${m} : ${s}`;
    } else {
      return `${m} : ${s}`;
    }
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
          <p className='medium'>
            {!isRunning ? '타이머' : '휴식 중이에요!'}
          </p>
          <p className={timeLeft > 3600 ? 'medium hour-text' : 'medium'}>
            {formatTime(timeLeft)}
          </p>
          <p>{!isRunning ? '시작을 눌러주세요.' : '남은 시간' }</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className='timer-buttons'>
        {!isRunning && (
          <>
            <SvgButton
              onClick={onClick}
              svgsrc={changetimeSvg}
              img={{w:16, h:19.5}}
              text="시간변경"
            />
            <SvgButton
              onClick={start}
              svgsrc={startSvg}
              img={{w:16, h:21}}
              text="시작"
            />
          </>
        )}
        {isRunning && (
          <>
            <SvgButton
              onClick={reset}
              svgsrc={resetSvg}
              img={{w:16, h:18.38}}
              text="재실행"
            />
            <SvgButton
              onClick={pause}
              svgsrc={pauseSvg}
              img={{w:18, h:18}}
              text="일시정지"
            />
          </>
        )}
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
        <button
          key={i}
          onClick={() => setTimerLength(min*60)}
        >{`${min}분`}</button>
      ))}
      
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>직접 설정</button>
      ) : (
        <div
          className='timer-input-modal-container'
          onClick={() => setIsEditing(false)}
        >
          <CustomTimeInputModal
            timerLength={timerLength}
            setTimerLength={setTimerLength}
            setIsEditing={setIsEditing}
          />
        </div>
      )}
    </>
  )
}

const computeTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec - h*3600) / 60);
  const s = Math.floor(sec % 60);
  let tmp = '';
  if (h) tmp += h + '시간 ';
  if (m) tmp += m + '분 ';
  if (s) tmp += s + '초 ';
  return tmp.trim();
}
function ComputedTime({ sec }) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec - h*3600) / 60);
  const s = Math.floor(sec % 60);
  return (
    <p>
      {!!h && <><span>{String(h).padStart(2, "0")}</span>시간 </>}
      {!!m && <><span>{String(m).padStart(2, "0")}</span>분 </>}
      {!!s && <><span>{String(s).padStart(2, "0")}</span>초 </>}
    </p>
  )
}

function TimePicker({ min=0, max, setValue, initialLength }) {
  const pickerRef = useRef(null);
  const itemRefs = useRef([]);
  const timerRef = useRef(null);
  const selectedRef = useRef(0);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    pickerRef.current.scrollTo({
      top: initialLength * 33,
      behavior: "smooth",
    });
  }, [initialLength])

  function handleScroll(e) {
    const pickerRect = pickerRef.current.getBoundingClientRect();
    const pickerCenterY = pickerRect.top + pickerRect.height / 2;
    let closestIndex = 0
    let minDistance;

    itemRefs.current.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenterY - pickerCenterY);
      if (i === 0 || distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      };
    })
    selectedRef.current = closestIndex;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setValue(selectedRef.current + min);
      setSelected(selectedRef.current + min);
    }, 100);
  }
  return (
    <div
      ref={pickerRef}
      className='time-picker'
      onScroll={handleScroll}
    >
      {Array(max - min).fill(0).map((_, i) => (
        <div
          key={i}
          ref={el => itemRefs.current[i] = el}
          className={selected === i ? 'picker-item medium selected' : 'picker-item medium'}
          onClick={() => {
            pickerRef.current.scrollTo({
              top: i * 33,
              behavior: "smooth",
            })
          }}
        >{min + i}</div>
      ))}
    </div>
  )
}
function CustomTimeInputModal({ timerLength, setTimerLength, setIsEditing }) {
  const [selectedTime, setSelectedTime] = useState({
    h: Math.floor(timerLength / 3600),
    m: Math.floor((timerLength - Math.floor(timerLength / 3600)*3600) / 60),
    s: Math.floor(timerLength % 60)
  });
  const setValue = (key, value) => {
    setSelectedTime(prev => ({
      ...prev,
      [key]: value
    }))
  }
  return (
    <>
      <div className='timer-input-modal' onClick={(e) => e.stopPropagation()}>
        <div className='timer-input-modal-wrapper'>
          <div className='time-picker-container'>
            <p onClick={() => setValue('h', 0)}>시</p>
            <p onClick={() => setValue('m', 0)}>분</p>
            <p onClick={() => setValue('s', 0)}>초</p>
            <TimePicker
              max={100}
              setValue={(value) => setValue('h', value)}
              initialLength={selectedTime.h}
            />
            <TimePicker
              max={60}
              setValue={(value) => setValue('m', value)}
              initialLength={selectedTime.m}
            />
            <TimePicker
              max={60}
              setValue={(value) => setValue('s', value)}
              initialLength={selectedTime.s}
            />
          </div>
          <div className='time-picker-center' />
          <button
            className='timer-modal-button'
            onClick={() => {
              let selectedSecond = selectedTime.h * 3600 + selectedTime.m * 60 + selectedTime.s;
              if (selectedSecond) setTimerLength(selectedSecond);
              setIsEditing(false)
            }}
          >
            <p className='medium'>설정완료</p>
          </button>
        </div>
      </div>
    </>
  )
}

function ImgButton({ src, text, onClick }) {
  return (
    <>
      <img
        onClick={onClick}
        width={80}
        src={src}
        style={{ position: 'absolute', top: -5, right: 20 }}
      />
      <button onClick={onClick}>
        <p
          className='semibold'
          style={{ fontSize: '18px' }}
        >{text}</p>
      </button>
    </>
  )
}

function TimerPopup({ contentType, timerLength, setShowPopup, setIsAutostart }) {
  const userId = localStorage.getItem("user_id");
  const contentDescription = {
    릴스: "째 릴스를 보고있어요",
    유튜브: "째 유튜브를 보고있어요",
    웹툰: "째 웹툰을 보고있어요",
    게임: "째 게임을 하고있어요",
    기타: "째 기타 콘텐츠를 하고있어요",
  }

  const navigate = useNavigate();

  return (
    <>
      <div className='timer-popup-container'>
        <section className='timer-popup'>
          <div className='timer-popup-wrapper'>
            <img src={timerSvg} width={31} height={38} />
            <p className='semibold'>{computeTime(timerLength) + contentDescription[contentType]}</p>
            <p style={{fontWeight:'bold'}}>잠시 쉬어가는 건 어떨까요?</p>
            <img src={rabbit_restingImg} height={241}/>
            <section className='timer-info'>
              <section>
                <p>설정한 휴식 시간</p>
                <ComputedTime sec={timerLength} />
              </section>
              <img src={carrotImg} width={85}/>
              <section>
                <p>미션 시 획득 당근</p>
                <p><span>+1</span>개</p>
              </section>
            </section>
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
                  backendAPI.postRestSkip(userId ?? 1);
                  setIsAutostart(true);
                  setShowPopup(false)
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function Timer({ timer_id, started_at=Date.now() }) {
  const [successCount, setSuccessCount] = useState(0);
  const [contentType, setContentType] = useState('');
  const [timerLength, setTimerLength] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isAutostart, setIsAutostart] = useState(false);
  
  const navigate = useNavigate();
  const locate = useLocation();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (locate.state) {
      setTimerLength(locate.state['timerLength']);
      setContentType(locate.state['contentType']);
    } else {
      navigate('/start')
    }
    setSuccessCount(backendAPI.getUserSuccessCount(userId ?? 1));
  }, [])

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";
    document.head.appendChild(link);
  }, []);

  
  return (
    <>
      <div className='timer-container'>
        <header className='timer-header'>
          <Header text='콘텐츠 이용 시간' />
        </header>
        <section className='timer-contentType'>
          <p className='medium'>{contentType + ' / ' + computeTime(timerLength) + ' 휴식 주기'}</p>
        </section>
        <section className='timer'>
          <TimerChart
            timerLength={timerLength}
            onClick={() => setShowSetting(!showSetting)}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            setShowPopup={setShowPopup}
            autostart={isAutostart}
          />
        </section>
        {!isRunning && showSetting &&
          <form
            className="timer-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className='semibold'>시간 설정</p>
            <div className="timer-input">
              <TimerInputButtons
                timerLength={timerLength}
                setTimerLength={setTimerLength}
              />
            </div>
          </form>
        }
        <section className="timer-rest-info">
          <img src={carrotImg} width={85} />
          <section className="timer-rest">
            <p>지금까지 휴식 시간</p>
            <p><span>추후 제공</span></p>
          </section>
          <section className="earned-carrots">
            <p>오늘 성공</p>
            <p><span>{successCount}</span>회</p>
          </section>
        </section>
      </div>
      {showPopup &&
        <TimerPopup
          contentType={contentType}
          timerLength={timerLength}
          setShowPopup={setShowPopup}
          setIsAutostart={setIsAutostart}
        />
      }
    </>
  )
}

export default Timer;