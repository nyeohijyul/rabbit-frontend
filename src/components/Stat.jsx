import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Stat.css";

import homeIcon from "../assets/icon_homeblack.png";
import timeIcon from "../assets/icon_orangetime.png";
import rewardIcon from "../assets/home_reward.png";

import { getUserStats } from "../api";

export default function Stat() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    const fetchStats = async () => {
      try {
        const data = await getUserStats(userId);
        console.log("통계 데이터:", data);
        setStats(data);
      } catch (error) {
        console.error("통계 데이터 조회 실패:", error);
      }
    };

    fetchStats();
  }, []);

  const successRate =
    stats?.success_rate ??
    stats?.successRate ??
    0;

  const successCount =
    stats?.success_count ??
    stats?.successCount ??
    0;

  const failCount =
    stats?.fail_count ??
    stats?.failCount ??
    0;

  const continuousStreak =
    stats?.continuous_streak ??
    stats?.continuousStreak ??
    0;

  const totalCarrots =
    stats?.total_carrots ??
    stats?.totalCarrots ??
    0;

  const totalCount = successCount + failCount;

  const chartDegree = successRate * 3.6;

  return (
    <div className="stat">
      <header className="stat-header">
        <button
          className="back-btn"
          onClick={() => navigate("/home")}
        >
          ‹
        </button>

        <h1>통계</h1>
      </header>

      <section className="stat-title-section">
        <h2>오늘도 정말 수고했어요!</h2>
        <p>꾸준한 작은 습관이 큰 변화를 만들어요</p>
      </section>

      <main className="stat-content">
        <section className="success-card">
          <div className="success-top">
            <div>
              <h3>휴식 성공률</h3>
              <p>
                성공 {successCount}회 / 전체 {totalCount}회
              </p>
            </div>

            <div
              className="circle-chart"
              style={{
                background: `conic-gradient(#fe9957 0deg ${chartDegree}deg, #ffe6d3 ${chartDegree}deg 360deg)`,
              }}
            >
              <span>
                {successRate}
                <small>%</small>
              </span>
            </div>
          </div>

          <div className="mini-cards">
            <div className="mini-card">
              <p>휴식 성공 횟수</p>
              <strong className="green">
                {successCount}회
              </strong>
            </div>

            <div className="mini-card">
              <p>휴식 건너뛰기</p>
              <strong className="orange">
                {failCount}회
              </strong>
            </div>

            <div className="mini-card">
              <p>연속 휴식 성공</p>
              <strong>{continuousStreak}회</strong>
            </div>
          </div>
        </section>

        <section className="detail-card">
          <div className="period">
            <h3>기간 선택</h3>
            <p>데이터 조회</p>
          </div>

          <div className="divider"></div>

          <div className="detail-list">
            <div className="detail-row">
              <div>
                <h4>휴식 성공률</h4>
                <p>성공 횟수 / 전체 횟수</p>
              </div>

              <strong>{successRate}%</strong>
            </div>

            <div className="detail-row">
              <div>
                <h4>휴식 성공횟수</h4>
                <p>오늘의 성공 횟수</p>
              </div>

              <strong className="green">
                {successCount}회
              </strong>
            </div>

            <div className="detail-row">
              <div>
                <h4>휴식 건너뛰기</h4>
                <p>휴식을 미룬 횟수</p>
              </div>

              <strong className="orange">
                {failCount}회
              </strong>
            </div>

            <div className="detail-row">
              <div>
                <h4>연속 휴식 성공 기록</h4>
                <p>현재 기준 연속 휴식 성공 횟수</p>
              </div>

              <strong>{continuousStreak}회</strong>
            </div>

            <div className="detail-row">
              <div>
                <h4>획득 당근</h4>
              </div>

              <strong>{totalCarrots}개</strong>
            </div>
          </div>
        </section>
      </main>

      <nav className="stat-bottom-nav">
        <div
          className="stat-nav-item"
          onClick={() => navigate("/home")}
        >
          <img src={homeIcon} alt="home" />
          <span>홈</span>
        </div>

        <div
          className="stat-nav-item active"
          onClick={() => navigate("/stat")}
        >
          <img src={timeIcon} alt="time" />
          <span>통계</span>
        </div>

        <div
          className="stat-nav-item"
          onClick={() => navigate("/reward")}
        >
          <img src={rewardIcon} alt="reward" />
          <span>보상</span>
        </div>
      </nav>
    </div>
  );
}