const API_URL = "http://15.164.93.68:8080";

/* =========================
   온보딩
========================= */
export const onboardingUser = async (username) => {
  const response = await fetch(
    `${API_URL}/users/onboarding`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "온보딩 실패"
    );
  }

  return data;
};

/* =========================
   홈 화면
========================= */
export const getHomeData = async (userId) => {
  const response = await fetch(
    `${API_URL}/users/${userId}/home`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "홈 데이터 조회 실패"
    );
  }

  return data;
};

/* =========================
   통계 화면
========================= */
export const getUserStats = async (userId) => {
  const response = await fetch(
    `${API_URL}/users/${userId}/stats`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "통계 조회 실패"
    );
  }

  return data;
};

/* =========================
   보상 화면
========================= */
export const getUserRewards = async (userId) => {
  const response = await fetch(
    `${API_URL}/users/${userId}/rewards`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "보상 조회 실패"
    );
  }

  return data;
};

/* =========================
   타이머 시작 화면
========================= */
export const postTimerStart = async (userId, contentType, timerLength) => {
  const response = await fetch(`${API_URL}/timer/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      userId,
      contentType,
      focusMinutes: timerLength / 60,
      restMinutes: 0
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

/* =========================
   타이머 화면 - 미션 스킵 시
========================= */
export const postRestSkip = async (userId) => {
  const response = await fetch(`${API_URL}/rest/skip?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data)
  return data;
};

/* =========================
   미션 화면 - 미션 성공 시
========================= */
export const postRestSuccess = async (user_id, timer_id, is_correct=true) => {
  console.log({
      user_id, timer_id, is_correct
    })
  const response = await fetch(`${API_URL}/rest/success`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id, timer_id, is_correct
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};