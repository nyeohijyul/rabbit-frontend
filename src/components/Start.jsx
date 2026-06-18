import { useState, useEffect } from 'react';
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

function TimerInputButtons({ setTimerLength }) {
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
            setTimerLength(min);
            setSelected(i);
            setIsEditing(false);
          }}
          className = { (!isEditing && selected == i) ? "checked" : null }
        >
          {`${min}분`}
        </button>
      ))}
      {/* <button onClick={ () => {} }>직접 설정</button> */}
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>직접 설정</button>
      ) : (
        <input
          className='input-button checked'
          autoFocus
          onChange={(e) => {
            if (Number.isNaN(Number(e.target.value))) {
              setTimerLength('');
              e.target.value='';
            } else {
              setTimerLength(e.target.value);
            }
          }}
        />
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
  const [timerlength, setTimerLength] = useState();
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
            <TimerInputButtons setTimerLength={setTimerLength}/>
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