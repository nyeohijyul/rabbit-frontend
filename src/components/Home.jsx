import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import roomBg from "../assets/room_background.png";
import rabbitHappy from "../assets/rabbit_happy.png";
import rabbitTired from "../assets/rabbit_tired.png";
import rabbitExhausted from "../assets/rabbit_exhausted.png";
import carrot from "../assets/carrot.png";
import ringIcon from "../assets/home_ring.png";
import ringOffIcon from "../assets/ring_off.png";
import nextIcon from "../assets/home_next.png";
import playIcon from "../assets/home_play.png";
import homeIcon from "../assets/home_home.png";
import timeIcon from "../assets/home_time.png";
import rewardIcon from "../assets/home_reward.png";
import rabbitStart from "../assets/icon_rabbittstart.png";

import { getHomeData } from "../api";

export default function Home() {
  const navigate = useNavigate();

  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [homeData, setHomeData] = useState(null);

  const username = localStorage.getItem("username") || "사용자 이름";

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    const fetchHomeData = async () => {
      try {
        const data = await getHomeData(userId);
        console.log("홈 데이터:", data);
        setHomeData(data);
      } catch (error) {
        console.error("홈 데이터 조회 실패:", error);
      }
    };

    fetchHomeData();
  }, []);

  const getRabbitImage = () => {
    switch (homeData?.rabbit_state) {
      case "HEALTHY":
        return rabbitHappy;
      case "TIRED":
        return rabbitTired;
      case "EXHAUSTED":
        return rabbitExhausted;
      default:
        return rabbitHappy;
    }
  };

  const getRabbitMessage = () => {
  switch (homeData?.rabbit_state) {
    case "TIRED":
      return "조금 피곤해졌어요...";

    case "EXHAUSTED":
      return "많이 지쳐보여요...";

    default:
      return "휴식도 중요한 기록이에요!";
  }
};

  return (
    <div className="home">
      <header className="home-header">
        <div className="profile-circle" />

        <p className="header-text">
          {username}님, 오늘도
          <br />
          잘 쉬어갈 준비 됐나요?
        </p>

        <img
          src={isAlarmOn ? ringIcon : ringOffIcon}
          alt="알림"
          className="ring-icon"
          onClick={() => setIsAlarmOn(!isAlarmOn)}
        />
      </header>

      <section className="hero-card">
        <img src={roomBg} alt="room" className="room-bg" />

        <div className="speech-box">
          {getRabbitMessage()}
        </div>
        <div className="speech-tail"></div>

        <div className="carrot-card">
          <img src={carrot} alt="carrot" />
          <div>
            <span>보유당근</span>
            <strong>{homeData?.total_carrots ?? 12}개</strong>
          </div>
        </div>

        <img
          src={getRabbitImage()}
          alt="rabbit"
          className="hero-rabbit"
        />
      </section>

      <section className="record-section">
        <div className="record-title-row">
          <h2>오늘의 기록</h2>

          <button onClick={() => navigate("/stat")}>
            자세히 보기
            <img src={nextIcon} alt="" />
          </button>
        </div>

        <div className="record-cards">
          <div className="record-card">
            <p>총 쉬는 시간</p>
            <strong>추후 제공</strong>
          </div>

          <div className="record-card">
            <p>성공한 휴식</p>
            <strong>{homeData?.successCount ?? 0}회</strong>
          </div>

          <div className="record-card">
            <p>연속 성공</p>
            <strong>{homeData?.continuousStreak ?? 0}일</strong>
          </div>
        </div>
      </section>

      <button
        className="start-button"
        onClick={() => navigate("/stat")}
      >
        <img src={playIcon} alt="" className="play-icon" />
        <span>콘텐츠 시작하기</span>
        <img
          src={rabbitStart}
          alt=""
          className="start-rabbit"
        />
      </button>

      <section className="growth-card">
        <p>
          작은 휴식이 쌓여<br />
          큰 변화를 만들어요 ✨
        </p>

        <button onClick={() => navigate("/stat")}>
          나의 성장 보기
          <img src={nextIcon} alt="" />
        </button>
      </section>

      <nav className="bottom-nav">
        <div
          className="nav-item active"
          onClick={() => navigate("/home")}
        >
          <img src={homeIcon} alt="홈" />
          <span>홈</span>
        </div>

        <div
          className="nav-item"
          onClick={() => navigate("/stat")}
        >
          <img src={timeIcon} alt="통계" />
          <span>통계</span>
        </div>

        <div
          className="nav-item"
          onClick={() => navigate("/reward")}
        >
          <img src={rewardIcon} alt="보상" />
          <span>보상</span>
        </div>
      </nav>
    </div>
  );
}