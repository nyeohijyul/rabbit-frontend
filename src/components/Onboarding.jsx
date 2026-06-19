import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

import rabbitHi from "../assets/rabbit_hi.png";
import humanIcon from "../assets/onboarding_human.png";
import nextIcon from "../assets/onboarding_next.png";

import { onboardingUser } from "../api";

export default function Onboarding() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = name.trim().length > 0;

  const handleNext = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      const result = await onboardingUser(name);

      console.log("온보딩 성공:", result);

      localStorage.setItem("user_id", result.id ?? result.user_id);
      localStorage.setItem("username", result.username ?? name);

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.message || "서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding">
      <h1 className="onboarding-title">
        <span>안녕하세요!</span>
        <span className="second-line">만나서 반가워요 🖤</span>
      </h1>

      <p className="onboarding-subtitle">
        당신의 휴식 여정을 함께할
        <span> 모모 </span>
        라고 해요.
        <br />
        어떻게 부르면 좋을까요?
      </p>

      <img src={rabbitHi} alt="rabbit" className="rabbit-hi" />

      <section className="onboarding-card">
        <h2>당신의 이름을 알려주세요 🥕</h2>

        <p>
          입력한 이름으로 모모가 당신을
          불러줄 거예요!
        </p>

        <div className="name-input-box">
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <img src={humanIcon} alt="user" className="human-icon" />
        </div>

        <button
          className={`next-btn ${isValid ? "active" : ""}`}
          onClick={handleNext}
        >
          <span>{loading ? "저장 중..." : "다음"}</span>

          {!loading && (
            <img src={nextIcon} alt="next" className="next-icon" />
          )}
        </button>
      </section>
    </div>
  );
}