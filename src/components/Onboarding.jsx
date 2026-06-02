import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleStart = async () => {
    if (!name.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/users/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
        }),
      });

      if (!res.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await res.json();

      // 사용자 정보 저장
      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("username", data.username);

      // 홈 이동
      navigate("/home");
    } catch (error) {
      console.error("온보딩 실패:", error);
      setErrorMsg("이름 등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
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
        {loading ? "처리 중..." : "시작하기"}
      </button>

      {errorMsg && (
        <p style={{ color: "red" }}>{errorMsg}</p>
      )}
    </div>
  );
}

export default Onboarding;