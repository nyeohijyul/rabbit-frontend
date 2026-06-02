const stateMessage = {
  HEALTHY: "토끼가 건강합니다.",
  TIRED: "토끼가 피곤해요.",
};

function RestSuccess({ rabbitState }) {
  return (
    <>
    <h2>🥕 +1 획득</h2>
    <p>잘 쉬었어요! 🎉<br/>토끼가 당근을 먹고 힘을 냈어요 🥕</p>
    <p>{stateMessage[rabbitState] ?? "알 수 없는 상태입니다."}</p>
    
    {/* 홈 화면 이동 */}
    <button>확인</button>
    </>
  )
}

export default RestSuccess;