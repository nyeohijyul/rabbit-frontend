import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import './RestSuccess.css';

import rabbitImg from '../assets/rabbit_happy.png';
import reelsImg from '../assets/reels.png';
import youtubeImg from '../assets/youtube.png';
import webtoonImg from '../assets/webtoon.png';
import gameImg from '../assets/game.png';
import etcImg from '../assets/setting.png';

import rabbit_eatcarrotImg from '../assets/rabbit_eatcarrot.png';
import carrotImg from '../assets/carrot.png';
import backSvg from '../assets/back.svg'
import homeSvg from '../assets/home.svg'
import restSvg from '../assets/rest.svg'

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
          style={{ marginRight: '12px' }}
        />
        {text}
      </button>
    </>
  )
}

function ComputedTime({ sec }) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec - h*3600) / 60);
  const s = Math.floor(sec % 60);
  console.log(h, m, s)
  return (
    <p>
      {!!h && <><span>{String(h).padStart(2, "0")}</span>시간 </>}
      {!!m && <><span>{String(m).padStart(2, "0")}</span>분 </>}
      {!!s && <><span>{String(s).padStart(2, "0")}</span>초 </>}
    </p>
  )
}

function Modal({ contentType, setContentType, setIsChanging }) {
  const contents = [
    {type: "릴스", img: reelsImg},
    {type: "유튜브", img: youtubeImg},
    {type: "웹툰", img: webtoonImg},
    {type: "게임", img: gameImg},
    {type: "기타", img: etcImg}
  ];
  return (
    <>
      <div className='rest-success-modal' onClick={(e) => e.stopPropagation()}>
        <div className='rest-success-modal-wrapper'>
          <form
            className="rest-success-form"
            onSubmit={(e) => e.preventDefault()}>
            <div className="rest-success-content-input">
              {contents.map((content, i) => (
                <label className="content-type-option" key={i}>
                  <input
                    type="radio"
                    name="contentType"
                    value={content.type}
                    onChange={() => setContentType(content.type)}
                    checked={contentType === content.type}
                  />
                  <img src={content.img} width={73}/>
                  <p className='medium'>{content.type}</p>
                </label>
              ))}
            </div>
          </form>
          <button
            className='rest-success-modal-button'
            onClick={() => {
              setIsChanging(false)
            }}
          >
            <p className='medium'>설정완료</p>
          </button>
        </div>
      </div>
    </>
  )
}

function RestSuccess() {
  const [contentType, setContentType] = useState('');
  const [timerLength, setTimerLength] = useState(600);

  const [isChanging, setIsChanging] = useState(false);

  const navigate = useNavigate();
  const locate = useLocation();
  
  const userId = localStorage.getItem("user_id");

  const contentSrc = {
    릴스 : reelsImg,
    유튜브 : youtubeImg,
    웹툰 : webtoonImg,
    게임 : gameImg,
    기타 : etcImg
  };
  const imgSrc = contentSrc[contentType];
  
  useEffect(() => {
    if (!userId) navigate('/');
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
  
  return (
    <>
      <div className="rest-success-container">
        <header className="rest-success-header">
          <Header text="휴식 완료" />
        </header>
        <section className="rest-success-content">
          <p style={{fontWeight:"bold"}}>모모가 당근을 먹고<br />힘을 냈어요!</p>
          <p className='medium'>휴식을 성공할수록 더 많은 당근을 모을 수 있어요!</p>
          <img src={rabbit_eatcarrotImg} height={233}/>
          <section className="rest-success-card">
            <section className="content-info">
              <img src={imgSrc} width={56}/>
              <div className="content-type">
                <p>선택한 콘텐츠</p>
                <p className='semibold'>{contentType}</p>
              </div>
              <div className="type-buttons">
                <button
                  className='medium'
                  onClick={() => setIsChanging(true)}
                >변경하기</button>
              </div>
            </section>
            <section className="rest-info">
              <img src={carrotImg} width={70} />
              <div className="rest-time">
                <p>이번 휴식 시간</p>
                <ComputedTime sec={timerLength} />
              </div>
              <div className="earned-carrots">
                <p>획득한 당근</p>
                <p><span>+1</span>개</p>
              </div>
            </section>
            <section className="rest-success-comments">
              <p className='medium'>정말 잘 쉬었어요!</p>
              <p>이대로 꾸준히 휴식을 지켜봐요!</p>
            </section>
          </section>
          <div className="rest-success-buttons">
            <SvgButton
              svgsrc={homeSvg}
              img={{w: 17, h: 18}}
              text='홈으로 이동'
              onClick={() => navigate('/home')}
            />
            <SvgButton
              svgsrc={restSvg}
              img={{w: 18, h: 18}}
              text='다시 휴식하기'
              onClick={() => navigate('/start')}
            />
          </div>
        </section>
      </div>
      {isChanging && 
        <div
          className="rest-success-modal-container"
          onClick={() => setIsChanging(false)}
        >
          <Modal contentType={contentType} setContentType={setContentType} setIsChanging={setIsChanging} />
        </div>
      }
    </>
  )
}

export default RestSuccess;