import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reward.css";

import carrot from "../assets/carrot.png";

import rabbitHappy from "../assets/rabbit_happy.png";
import rabbitYellow from "../assets/rabbit_yellow.png";
import rabbitPink from "../assets/rabbit_pink.png";
import rabbitBlue from "../assets/rabbit_blue.png";

import roomBg from "../assets/room_background.png";
import fieldBg from "../assets/field_background.png";
import flowerBg from "../assets/flower_background.png";
import nightBg from "../assets/night_background.png";
import sunBg from "../assets/sun_background.png";

import yellowRibbon from "../assets/yellow_ribbon.png";
import pinkRibbon from "../assets/pink_ribbon.png";
import blueRibbon from "../assets/blue_ribbon.png";

import lockIcon from "../assets/lock.png";
import checkIcon from "../assets/check.png";

import homeIcon from "../assets/icon_homeblack.png";
import timeIcon from "../assets/home_time.png";
import rewardIcon from "../assets/icon_rewardorange.png";

import { getUserRewards } from "../api";

export default function Reward() {
  const navigate = useNavigate();

  const [rewards, setRewards] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState("room");
  const [selectedRibbon, setSelectedRibbon] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    const fetchRewards = async () => {
      try {
        const data = await getUserRewards(userId);
        console.log("보상 데이터:", data);
        setRewards(data);
      } catch (error) {
        console.error("보상 데이터 조회 실패:", error);
      }
    };

    fetchRewards();
  }, []);

  const totalCarrots =  rewards?.total_carrots ??
  rewards?.totalCarrots ??
  0;

  const backgrounds = [
    {
      id: "room",
      name: "기본 배경",
      img: roomBg,
      owned: true,
      label: "기본 배경",
    },
    {
      id: "field",
      name: "봄날의 들판",
      img: fieldBg,
      owned: rewards?.field_background ?? rewards?.fieldBackground ?? false,
      label: "당근 40",
    },
    {
      id: "sunset",
      name: "노을진 거리",
      img: sunBg,
      owned: rewards?.sun_background ?? rewards?.sunBackground ?? false,
      label: "당근 50",
    },
    {
      id: "night",
      name: "밤하늘",
      img: nightBg,
      owned: rewards?.night_background ?? rewards?.nightBackground ?? false,
      label: "당근 60",
    },
    {
      id: "cherry",
      name: "벚꽃 풍경",
      img: flowerBg,
      owned:
        rewards?.cherry_blossom_background ??
        rewards?.cherryBlossomBackground ??
        false,
      label: "당근 70",
    },
  ];

  const ribbons = [
    {
      id: "yellow",
      name: "노랑 리본",
      img: yellowRibbon,
      rabbit: rabbitYellow,
      owned: rewards?.yellow_ribbon ?? rewards?.yellowRibbon ?? false,
      label: "당근 10",
    },
    {
      id: "pink",
      name: "분홍 리본",
      img: pinkRibbon,
      rabbit: rabbitPink,
      owned: rewards?.pink_ribbon ?? rewards?.pinkRibbon ?? false,
      label: "당근 20",
    },
    {
      id: "blue",
      name: "파랑 리본",
      img: blueRibbon,
      rabbit: rabbitBlue,
      owned: rewards?.blue_ribbon ?? rewards?.blueRibbon ?? false,
      label: "당근 30",
    },
  ];

  const selectedBg =
    backgrounds.find((bg) => bg.id === selectedBackground) ?? backgrounds[0];

  const selectedRibbonData = ribbons.find(
    (ribbon) => ribbon.id === selectedRibbon
  );

  const previewRabbit = selectedRibbonData
    ? selectedRibbonData.rabbit
    : rabbitHappy;

  const ownedBackgroundCount = backgrounds.filter((bg) => bg.owned).length;
  const ownedRibbonCount = ribbons.filter((ribbon) => ribbon.owned).length;

  const handleBackgroundClick = (background) => {
    if (!background.owned) return;
    setSelectedBackground(background.id);
  };

  const handleRibbonClick = (ribbon) => {
    if (!ribbon.owned) return;
    setSelectedRibbon(ribbon.id);
  };

  return (
    <div className="reward">
      <header className="reward-header">
        <button className="reward-back" onClick={() => navigate("/home")}>
          ‹
        </button>

        <h1>보상</h1>

        <div className="reward-carrot">
          <img src={carrot} alt="carrot" />
          <span>{totalCarrots}</span>
        </div>
      </header>

      <section className="reward-title">
        <h2>더 예쁜 나만의 공간을 꾸며보세요!</h2>
        <p>획득한 당근으로 배경과 리본을 구매할 수 있어요</p>
      </section>

      <section className="reward-preview">
        <img src={selectedBg.img} alt={selectedBg.name} className="preview-bg" />
        <img src={previewRabbit} alt="rabbit" className="preview-rabbit" />
      </section>

      <section className="reward-section">
        <div className="reward-section-title">
          <h3>배경</h3>
          <span>보유 {ownedBackgroundCount}/5</span>
        </div>

        <div className="background-list">
          {backgrounds.map((background) => (
            <div
              key={background.id}
              className={`bg-item ${
                selectedBackground === background.id ? "selected" : ""
              } ${background.owned ? "owned" : "locked"}`}
              onClick={() => handleBackgroundClick(background)}
            >
              <div className="thumb">
                <img src={background.img} alt={background.name} />

                {selectedBackground === background.id && (
                  <img
                    src={checkIcon}
                    alt="선택"
                    className="state-icon"
                  />
)}

{!background.owned && (
  <img
    src={lockIcon}
    alt="잠금"
    className="state-icon"
  />
)}
              </div>

              <p>{background.owned ? background.name : background.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reward-section ribbon-section">
        <div className="reward-section-title">
          <h3>리본</h3>
          <span>보유 {ownedRibbonCount}/3</span>
        </div>

        <div className="ribbon-list">
          {ribbons.map((ribbon) => (
            <div
              key={ribbon.id}
              className={`ribbon-item ${
                selectedRibbon === ribbon.id ? "selected" : ""
              } ${ribbon.owned ? "owned" : "locked"}`}
              onClick={() => handleRibbonClick(ribbon)}
            >
              <img src={ribbon.img} alt={ribbon.name} className="ribbon-img" />

              {selectedRibbon === ribbon.id && (
                <img
                  src={checkIcon}
                  alt="선택"
                  className="ribbon-lock"
                />
)}

{!ribbon.owned && (
  <img
    src={lockIcon}
    alt="잠금"
    className="ribbon-lock"
  />
)}

              <p>{ribbon.owned ? ribbon.name : ribbon.label}</p>
            </div>
          ))}
        </div>
      </section>

      <nav className="reward-bottom-nav">
        <div className="reward-nav-item" onClick={() => navigate("/home")}>
          <img src={homeIcon} alt="홈" />
          <span>홈</span>
        </div>

        <div className="reward-nav-item" onClick={() => navigate("/stat")}>
          <img src={timeIcon} alt="통계" />
          <span>통계</span>
        </div>

        <div
          className="reward-nav-item active"
          onClick={() => navigate("/reward")}
        >
          <img src={rewardIcon} alt="보상" />
          <span>보상</span>
        </div>
      </nav>
    </div>
  );
}