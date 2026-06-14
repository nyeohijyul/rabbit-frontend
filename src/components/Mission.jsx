// 미션 화면
/**
 * @param { user_id, timer_id, is_correct }
 * @returns { result, added_carrot, total_carrots, rabbit_state }
 * 1. 미션 선택
 * 2. 미션 성공 ? "잘했어요" : "다시 시도해보세요"
 * {
        “result”: “SUCCESS”,
        "added_carrot": 1,
        "total_carrots": 13,
        "rabbit_state": "HEALTHY"
    }
” 정답이에요! 🎉
토끼가 당근을 먹고 힘을 냈어요 🥕”
” 아쉬워요 😢한 번 더 도전해볼까요?”
 */

import { useState, useEffect } from "react";

const BASE_URL = "http://15.164.93.68:8080";

const url = `${BASE_URL}/rest/success`;

const missions = [
  { title: "랜덤 계산 문제", description: "설명" },
  { title: "랜덤 구구단 문제", description: "설명" }
];

const backendAPI = {
  postSuccess: async (user_id, timer_id, is_correct) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ user_id, timer_id, is_correct }),
      body: JSON.stringify({
        "user_id": 1,
        "timer_id": 15,
        "is_correct": is_correct
      })
    });
    const data = await response.json();
    return data;
  }
}

function MissionSection({ mission, onSelect }) {
  return (
    <section onClick={ onSelect }>
      <h3>{ mission.title }</h3>
      <p>{ mission.description }</p>
    </section>
  )
}

function MissionSelection({ setSelectedMission, setIsSelected }) {
  return (
    <div className="mission-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>미션을 선택하세요.</h2>
      {missions.map((mission, index) => (
        <MissionSection
            key={index}
            mission={mission}
            onSelect={() => {setSelectedMission(index); setIsSelected(true);}}
        />
      ))}
    </div>
  )
}

/**
 * 
 * @param index : 0 - 랜덤 계산 문제, 1 - 랜덤 구구단 문제
 * @returns { question, answer }
 */
function randomMission(index) {
  switch (index) {
    case 0: {// 랜덤 계산 문제 생성
      let num1 = Math.floor(Math.random() * 99) + 1;
      let num2 = Math.floor(Math.random() * 99) + 1;
      let operator = Math.random() < 0.5 ? "+" : "-";
      return {
        question: `${num1} ${operator} ${num2}`,
        answer: operator === "+" ? num1 + num2 : num1 - num2
      };
    }
    case 1: {// 랜덤 구구단 문제 생성
      let num1 = Math.floor(Math.random() * 9) + 1;
      let num2 = Math.floor(Math.random() * 9) + 1;
      return {
        question: `${num1} × ${num2}`,
        answer: num1 * num2
      };
    }
    default:
        return;
  }
}

function MissionProcess({ selectedMission }) {

  const [missionData, setMissionData] = useState(null);
  useEffect(() => {
    setMissionData(randomMission(selectedMission));
  }, [selectedMission]);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
    
  return (
    <div className="mission-process">
      <h2>{missions[selectedMission].title}</h2>
      <p>{missionData?.question}</p>
        <input
          type="text"
          placeholder="답을 입력하세요"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <button onClick={async () => {
          if (Number(userAnswer) === missionData.answer) {
            setResult("정답이에요! 🎉 토끼가 당근을 먹고 힘을 냈어요 🥕");
            await backendAPI.postSuccess("user_id", "timer_id", true);
            // RestSuccess로 이동
          } else {
            // backendAPI.postSuccess("user_id", "timer_id", false);
            setResult("아쉬워요 😢 한 번 더 도전해볼까요?");
          }
        }}>입력</button>
      <p>{result}</p>
    </div>
  )
}

function Mission() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <>
    {!isSelected && <MissionSelection setSelectedMission={setSelectedMission} setIsSelected={setIsSelected} />}
    {isSelected && <MissionProcess selectedMission={selectedMission} />}
    </>
  )
}

export default Mission;