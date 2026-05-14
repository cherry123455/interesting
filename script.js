const STORAGE_KEY = "truth-dare-party-v1";

const builtInQuestions = {
  truth: [
    "最近一次让你特别开心的事情是什么？",
    "你小时候做过最尴尬的一件小事是什么？",
    "如果可以拥有一种超能力，你最想要什么？",
    "你最近一次撒的小谎是什么？",
    "你最想和哪位朋友一起去旅行？",
    "你有什么别人很少知道的小习惯？",
    "你最容易被哪句话打动？",
    "如果明天放假一天，你会怎么安排？",
    "你曾经偷偷崇拜过谁？",
    "你最近一次感到紧张是因为什么？",
    "你最想重新体验哪一天？",
    "你认为自己最可爱的缺点是什么？"
  ],
  dare: [
    "对右边的人说一句真诚的夸奖。",
    "用夸张语气说一句“我今天超开心”。",
    "做一个搞怪表情，坚持 5 秒。",
    "唱一句你最近听过的歌。",
    "用三种不同语气读出自己的名字。",
    "和任意一位玩家击掌。",
    "模仿主持人介绍下一位玩家。",
    "用一句话给自己取一个派对称号。",
    "摆一个电影海报姿势，坚持 5 秒。",
    "对大家比一个胜利手势并说一句口号。",
    "用手边的东西临时当麦克风说一句开场白。",
    "闭眼转一圈，然后指向下一位幸运玩家。"
  ]
};

const state = {
  players: [],
  currentIndex: 0,
  round: 1,
  lastType: "truth",
  customType: "truth",
  customQuestions: {
    truth: [],
    dare: []
  },
  currentQuestion: null
};

const elements = {
  currentPlayer: document.querySelector("#current-player"),
  roundCount: document.querySelector("#round-count"),
  questionType: document.querySelector("#question-type"),
  questionSource: document.querySelector("#question-source"),
  questionText: document.querySelector("#question-text"),
  drawTruth: document.querySelector("#draw-truth"),
  drawDare: document.querySelector("#draw-dare"),
  nextPlayer: document.querySelector("#next-player"),
  repeatQuestion: document.querySelector("#repeat-question"),
  resetGame: document.querySelector("#reset-game"),
  playerForm: document.querySelector("#player-form"),
  playerName: document.querySelector("#player-name"),
  playerList: document.querySelector("#player-list"),
  playerCount: document.querySelector("#player-count"),
  customForm: document.querySelector("#custom-form"),
  customQuestion: document.querySelector("#custom-question"),
  customCount: document.querySelector("#custom-count"),
  customList: document.querySelector("#custom-list"),
  customTabs: document.querySelectorAll("[data-custom-type]")
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.players = Array.isArray(parsed.players) ? parsed.players : [];
    state.currentIndex = Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0;
    state.round = Number.isInteger(parsed.round) && parsed.round > 0 ? parsed.round : 1;
    state.lastType = parsed.lastType === "dare" ? "dare" : "truth";
    state.customQuestions.truth = Array.isArray(parsed.customQuestions?.truth) ? parsed.customQuestions.truth : [];
    state.customQuestions.dare = Array.isArray(parsed.customQuestions?.dare) ? parsed.customQuestions.dare : [];
    state.currentQuestion = parsed.currentQuestion || null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      players: state.players,
      currentIndex: state.currentIndex,
      round: state.round,
      lastType: state.lastType,
      customQuestions: state.customQuestions,
      currentQuestion: state.currentQuestion
    })
  );
}

function getActivePlayer() {
  return state.players[state.currentIndex] || "";
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getQuestionPool(type) {
  return [
    ...builtInQuestions[type].map((text) => ({ id: `built-in-${type}-${text}`, text, source: "内置题库" })),
    ...state.customQuestions[type].map((question) => ({ ...question, source: "自定义" }))
  ];
}

function pickQuestion(type) {
  const pool = getQuestionPool(type);
  const previousText = state.currentQuestion?.text;
  let candidates = pool;

  if (pool.length > 1) {
    candidates = pool.filter((question) => question.text !== previousText);
  }

  const question = candidates[Math.floor(Math.random() * candidates.length)];
  state.lastType = type;
  state.currentQuestion = {
    type,
    text: question.text,
    source: question.source
  };
  saveState();
  render();
}

function goNextPlayer() {
  if (state.players.length === 0) {
    return;
  }

  state.currentIndex = (state.currentIndex + 1) % state.players.length;
  if (state.currentIndex === 0) {
    state.round += 1;
  }
  state.currentQuestion = null;
  saveState();
  render();
}

function deletePlayer(index) {
  state.players.splice(index, 1);
  if (state.currentIndex >= state.players.length) {
    state.currentIndex = 0;
  }
  if (state.players.length === 0) {
    state.round = 1;
    state.currentQuestion = null;
  }
  saveState();
  render();
}

function deleteCustomQuestion(type, id) {
  state.customQuestions[type] = state.customQuestions[type].filter((question) => question.id !== id);
  saveState();
  render();
}

function renderPlayerList() {
  elements.playerList.innerHTML = "";
  elements.playerCount.textContent = `${state.players.length} 人`;

  if (state.players.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "先加 2 个以上玩家会更好玩。";
    elements.playerList.append(empty);
    return;
  }

  state.players.forEach((player, index) => {
    const item = document.createElement("li");
    item.className = `player-item${index === state.currentIndex ? " active" : ""}`;

    const name = document.createElement("span");
    name.className = "item-text";
    name.textContent = player;

    const button = document.createElement("button");
    button.className = "delete-button";
    button.type = "button";
    button.title = `删除 ${player}`;
    button.setAttribute("aria-label", `删除 ${player}`);
    button.innerHTML = deleteIcon();
    button.addEventListener("click", () => deletePlayer(index));

    item.append(name, button);
    elements.playerList.append(item);
  });
}

function renderCustomQuestions() {
  const activeList = state.customQuestions[state.customType];
  const total = state.customQuestions.truth.length + state.customQuestions.dare.length;
  elements.customCount.textContent = `${total} 条`;
  elements.customList.innerHTML = "";

  elements.customTabs.forEach((tab) => {
    const isActive = tab.dataset.customType === state.customType;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (activeList.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = state.customType === "truth" ? "还没有自定义真心话。" : "还没有自定义大冒险。";
    elements.customList.append(empty);
    return;
  }

  activeList.forEach((question) => {
    const item = document.createElement("li");
    item.className = "custom-item";

    const text = document.createElement("span");
    text.className = "item-text";
    text.textContent = question.text;

    const button = document.createElement("button");
    button.className = "delete-button";
    button.type = "button";
    button.title = "删除题目";
    button.setAttribute("aria-label", "删除题目");
    button.innerHTML = deleteIcon();
    button.addEventListener("click", () => deleteCustomQuestion(state.customType, question.id));

    item.append(text, button);
    elements.customList.append(item);
  });
}

function renderQuestion() {
  const hasPlayers = state.players.length > 0;
  elements.drawTruth.disabled = !hasPlayers;
  elements.drawDare.disabled = !hasPlayers;
  elements.nextPlayer.disabled = !hasPlayers;
  elements.repeatQuestion.disabled = !hasPlayers;

  if (!hasPlayers) {
    elements.currentPlayer.textContent = "先添加玩家";
    elements.roundCount.textContent = "第 1 轮";
    elements.questionType.textContent = "等待抽题";
    elements.questionSource.textContent = "内置题库";
    elements.questionText.textContent = "添加玩家后，选择真心话或大冒险开始。";
    return;
  }

  elements.currentPlayer.textContent = getActivePlayer();
  elements.roundCount.textContent = `第 ${state.round} 轮`;

  if (!state.currentQuestion) {
    elements.questionType.textContent = "等待抽题";
    elements.questionSource.textContent = "轮到你了";
    elements.questionText.textContent = `${getActivePlayer()}，选一个题目开始吧。`;
    return;
  }

  elements.questionType.textContent = state.currentQuestion.type === "truth" ? "真心话" : "大冒险";
  elements.questionSource.textContent = state.currentQuestion.source;
  elements.questionText.textContent = state.currentQuestion.text;
}

function render() {
  renderPlayerList();
  renderCustomQuestions();
  renderQuestion();
}

function deleteIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18"></path>
      <path d="M8 6V4h8v2"></path>
      <path d="M19 6l-1 14H6L5 6"></path>
      <path d="M10 11v5"></path>
      <path d="M14 11v5"></path>
    </svg>
  `;
}

elements.playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = normalizeName(elements.playerName.value);

  if (!name || state.players.includes(name)) {
    elements.playerName.value = "";
    return;
  }

  state.players.push(name);
  elements.playerName.value = "";
  saveState();
  render();
});

elements.customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = elements.customQuestion.value.trim().replace(/\s+/g, " ");

  if (!text) {
    return;
  }

  state.customQuestions[state.customType].push({
    id: makeId(),
    text
  });
  elements.customQuestion.value = "";
  saveState();
  render();
});

elements.customTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.customType = tab.dataset.customType;
    render();
  });
});

elements.drawTruth.addEventListener("click", () => pickQuestion("truth"));
elements.drawDare.addEventListener("click", () => pickQuestion("dare"));
elements.repeatQuestion.addEventListener("click", () => pickQuestion(state.lastType));
elements.nextPlayer.addEventListener("click", goNextPlayer);

elements.resetGame.addEventListener("click", () => {
  const shouldReset = window.confirm("确定要清空玩家、轮次和自定义题目吗？");
  if (!shouldReset) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  state.players = [];
  state.currentIndex = 0;
  state.round = 1;
  state.lastType = "truth";
  state.customType = "truth";
  state.customQuestions = {
    truth: [],
    dare: []
  };
  state.currentQuestion = null;
  render();
});

loadState();
render();
