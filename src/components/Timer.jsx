// 타이머
/**
 * @param contentType : 릴스, 쇼츠, 웹툰, 게임, 기타(직접입력)
 * 1. 타이머 시간 설정
 * 2. startedAt -> 종료시각 계산
 * 3. 현재시각 - 종료시각 보여주기
 * 4. 콘텐츠 유형 보여주기
 * 5. 종료하기 버튼
 * 
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TimerChart({ started_at, timerLength }) {
  const endAt =
    new Date(started_at).getTime() +
    timerLength * 60 * 1000;

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      setRemaining(
        Math.max(0, Math.floor((endAt - Date.now()) / 1000))
      );
      if (Math.max(0, Math.floor((endAt - Date.now()) / 1000)) === 0) {
        clearInterval(interval);
      }
    };

    update();

    const interval = setInterval(update, 1000);
    
    return () => clearInterval(interval);
  }, [endAt]);

  return (
    <>
    <p>남은 시간: {Math.floor(remaining / 60)}분 {remaining % 60}초</p>
    <div style={{ width: "100%", height: "30px", padding: "5px", boxSizing: "border-box" }}>
      <div style={{ width: `${(remaining / (timerLength * 60)) * 100}%`, height: "100%", backgroundColor: "green" }} />
    </div>
    </>
  );
}

function Timer({ timer_id, started_at=Date.now(), contentType, timerLength=10 }) {
  const navigate = useNavigate();
  return (
    <>
    {/* Home 으로 이동 */}
    <button onClick={() => navigate("/home")}>종료하기</button>

    <p>콘텐츠 유형: {contentType}</p>
    <TimerChart started_at={started_at} timerLength={timerLength} />
    </>
  )
}

export default Timer;