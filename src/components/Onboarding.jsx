import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim() || loading) return;

    setLoading(true);

    // 더미 데이터 저장
    localStorage.setItem("user_id", "1");
    localStorage.setItem("username", name);

    // 홈으로 이동
    navigate("/home");
  };

  return (
    <div>
      <h1>안녕하세요 👋</h1>
      <p>토끼와 함께 건강한 휴식 습관을 만들어봐요.</p>

      <input
        type="text"
        placeholder="이름을 입력해주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleStart}
        disabled={!name.trim() || loading}
      >
        시작하기
      </button>
    </div>
  );
}

export default Onboarding;