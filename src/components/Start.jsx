/**
 * {
"timer_id": 15,
"started_at": "2026-06-01T15:00:00",
"message": "타이머 시작"
}
 */
import { useState, useEffect } from 'react';

const BASE_URL = "./api";

const url = `${BASE_URL}/timer/start`;
const mockupResponse = JSON.parse(`
  {
    "timer_id": 15,
    "started_at": "2026-06-01T15:00:00",
    "message": "타이머 시작"
  }
`);

const backendAPI = {
  postTimerStart: async (contentType, timerLength) => {
    /*
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, timerLength }),
    });
    const data = await response.json();
    return data;
    */
    return mockupResponse;
  }
}

function ContentTypeOption({ contentType, setSelectedContentType }) {
  return (
    <label>
      <input type="radio" name="contentType" value={contentType} onChange={ () => setSelectedContentType(contentType) } />
      {contentType}
    </label>
  )
}

function ContentTypeSelection({ setSelectedContentType }) {
  const [userInput, setUserInput] = useState("");
  return (
    <>
    {contentTypes.map((contentType) => (
      <ContentTypeOption key={contentType} contentType={contentType} setSelectedContentType={setSelectedContentType} />
    ))}
    <label>
      <input type="radio" name="contentType" value={userInput} onChange={ () => setSelectedContentType(userInput) } />
      <input type="text" placeholder="콘텐츠 유형을 직접 입력하세요" value={userInput} onChange={ (e) => setUserInput(e.target.value) } />
    </label>
    </>
  )
}
function TimerSetterButton({ minute, setTimerLength }) {
  return (
    <button onClick={ () => setTimerLength(minute) }>
      {minute}분
    </button>
  )
}
function TimerChangeButton({ minutechange, setTimerLength, timerlength }) {
  return (
    <button onClick={ () => (timerlength + minutechange >= 3) && (timerlength + minutechange <= 120) && setTimerLength(timerlength + minutechange) }>
      {minutechange > 0 ? `+${minutechange}분` : `${minutechange}분`}
    </button>
  )
}
function TimerInput({ timerlength, setTimerLength }) {
  return (
    <label>
      타이머 시간: <input type="number" value={timerlength} min="3" max="120" step="1" onChange={ (e) => setTimerLength(Number(e.target.value)) } />
    </label>
  )
}

function Start() {
  const contentTypes = ["릴스", "쇼츠", "웹툰", "게임"];
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [timerlength, setTimerLength] = useState(20);

  return (
    <>
    {/* Home 으로 이동 */}
    <button>홈 복귀</button>
    
    <h2>타이머 설정</h2>
    <h4>콘텐츠 유형 선택</h4>
    <ContentTypeSelection setSelectedContentType={setSelectedContentType} />
    <h4>시간 설정</h4>
    <span>{timerlength}분</span>
    <TimerInput timerlength={timerlength} setTimerLength={setTimerLength} />
    <TimerSetterButton minute={20} setTimerLength={setTimerLength} />
    <TimerSetterButton minute={30} setTimerLength={setTimerLength} />
    <TimerSetterButton minute={40} setTimerLength={setTimerLength} />
    <TimerChangeButton minutechange={1} setTimerLength={setTimerLength} timerlength={timerlength} />
    <TimerChangeButton minutechange={-1} setTimerLength={setTimerLength} timerlength={timerlength} />
    <TimerChangeButton minutechange={5} setTimerLength={setTimerLength} timerlength={timerlength} />
    <button onClick={() => backendAPI.postTimerStart(selectedContentType, timerlength)}>시작하기</button>
    {/* Timer 로 이동 */}
    {/* context 이용해서 종료시각 계산하기? */}
    </>
  )
}

export default Start;