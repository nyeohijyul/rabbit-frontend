import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './Start.css';

import rabbitImg from '../assets/rabbit_happy.png';
import reelsImg from '../assets/reels.png';
import youtubeImg from '../assets/youtube.png';
import webtoonImg from '../assets/webtoon.png';
import gameImg from '../assets/game.png';
import etcImg from '../assets/setting.png';

import rabbit_healthyImg from '../assets/rabbit_healthy.png';
import startSvg from '../assets/start.svg'

const BASE_URL = "http://15.164.93.68:8080";

const url = `${BASE_URL}/timer/start`;

const backendAPI = {
  postTimerStart: async (contentType, timerLength) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ contentType, timerLength }),
      body: JSON.stringify({}),
    });
    const data = await response.json();
    console.log(data)
    return data;
  }
}

function ContentTypeOptions({ content, setSelectedContentType }) {
  return (
    <>
      {content.map((content, i) => (
        <label className="content-type-option" key={i}>
          <input type="radio" name="contentType" value={content.type} onChange={ () => setSelectedContentType(content.type) } />
          <img src={content.img} width={73}/>
          <p className='medium'>{content.type}</p>
        </label>
      ))}
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
            <TimePicker max={100} setValue={(value) => setValue('h', value)} initialLength={selectedTime.h} />
            <TimePicker max={60} setValue={(value) => setValue('m', value)} initialLength={selectedTime.m} />
            <TimePicker max={60} setValue={(value) => setValue('s', value)} initialLength={selectedTime.s} />
          </div>
          <div className='time-picker-center'></div>
          <button
            className='timer-modal-button'
            onClick={() => {
              setTimerLength(selectedTime.h * 3600 + selectedTime.m * 60 + selectedTime.s);
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
function TimerInputButtons({ timerLength, setTimerLength }) {
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = () => {
    setIsEditing(false);
  };

  return (
    <>
      {[10,15,20,30].map((min, i) => (
        <button
          key = {i}
          onClick = {() => {
            setTimerLength(min*60);
            setSelected(i);
            setIsEditing(false);
          }}
          className = { (!isEditing && selected == i) ? "checked" : null }
        >
          {`${min}분`}
        </button>
      ))}
      {!isEditing ? (
        <button className={selected === 'custom' ? "checked" : null} onClick={() => {setIsEditing(true); setSelected('custom');}}>직접 설정</button>
      ) : (
        <div className='timer-input-modal-container' onClick={() => setIsEditing(false)}>
          <CustomTimeInputModal timerLength={timerLength} setTimerLength={setTimerLength} setIsEditing={setIsEditing} />
        </div>
      )}
    </>
  )
}

function ImgButton({ src, svgsrc, text, onClick }) {
  return (
    <>
      <img onClick={onClick} width={100} src={src} style={{ position: 'absolute', top: -15, right: 30 }} />
      <button onClick={onClick}>
        <img src={svgsrc} width={20} height={20} style={{ marginRight: '12px' }} />
        <p className='semibold' style={{ fontSize: '18px' }}>{text}</p>
      </button>
    </>
  )
}

function Start() {
  const content = [
    {type: "릴스", img: reelsImg},
    {type: "유튜브", img: youtubeImg},
    {type: "웹툰", img: webtoonImg},
    {type: "게임", img: gameImg},
    {type: "기타", img: etcImg}
  ];
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [timerlength, setTimerLength] = useState(0);
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";
    document.head.appendChild(link);
  }, []);
  const navigate = useNavigate();

  function startTimer () {
    if (selectedContentType && timerlength) {
      backendAPI.postTimerStart(selectedContentType, timerlength);
      navigate("/timer", {
        state: {timerLength: timerlength, contentType: selectedContentType}
      })
    }
  }

  return (
    <>
    <div className="start-container">
      <div className="start-header">
        <img src={rabbitImg} alt="모모" height={227} />
        <div className='description'>
          <p className='semibold'>어떤 콘텐츠를<br />이용할까요?</p>
          <p>집중할 콘텐츠를 선택하면<br />모모가 휴식 타이밍을 알려줄게요!</p>
        </div>
      </div>
      <div className="start-content">
        <div className="start-form">
          <p className='semibold'>콘텐츠 선택</p>
          <div className="start-content-input">
            <ContentTypeOptions content={content} setSelectedContentType={setSelectedContentType} />
          </div>
        </div>
        <div className="start-form">
          <p className='semibold'>휴식 주기 선택</p>
          {/* <span>{timerlength}분</span> */}
          <div className="start-timer-input">
            <TimerInputButtons timerLength={timerlength} setTimerLength={setTimerLength}/>
          </div>
        </div>
        <div className="start-button">
          {/* <img src={rabbit_healthyImg} />
          <button onClick={() => backendAPI.postTimerStart(selectedContentType, timerlength)}>
            <img src={startSvg} width={20} height={20} style={{ marginRight: '12px' }} />
            <p className='semibold' style={{ fontSize: '18px' }}>시작하기</p>
          </button> */}
          <ImgButton src={rabbit_healthyImg} svgsrc={startSvg} text={'시작하기'} onClick={() => startTimer()} />
        </div>
      </div>
    </div>
    </>
  )
}

export default Start;