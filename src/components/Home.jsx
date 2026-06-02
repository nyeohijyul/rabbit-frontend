import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [carrot, setCarrot] = useState(0);
  const [rabbitState, setRabbitState] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      // user 없으면 onboarding으로 돌려보냄
      navigate("/");
      return;
    }

    console.log("userId:", userId);

    // 🔥 현재는 더미 데이터 (API 자리)
    setCarrot(12);
    setRabbitState("TIRED");
  }, [navigate]);

  return (
    <div>
      <h1>Home</h1>

      <p>🥕 {carrot}개</p>
      <p>🐰 {rabbitState}</p>

      <button onClick={() => navigate("/reward")}>
        보상 보기
      </button>

      <button onClick={() => navigate("/stat")}>
        통계 보기
      </button>
    </div>
  );
}

export default Home;