const baseMenu = "ポークカレー";

const riceOptions = [400, 500, 600, 700, 800];

const toppingOptions = [
  "手仕込みササミカツ（2本）",
  "手仕込みササミカツ（1本）",
  "フライドチキン（3個）",
  "フライドチキン（5個）",
  "ハーフ豚しゃぶ",
  "豚しゃぶ",
  "チキンカツ",
  "パリパリチキン",
  "コーン",
];

const minToppingCount = 1;
const maxToppingCount = 5;
const maxHistoryCount = 5;

const spinButton = document.querySelector("#spinButton");
const resultCard = document.querySelector("#resultCard");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");

let latestMenu = null;
let history = [];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomToppings() {
  const toppingCount =
    Math.floor(Math.random() * (maxToppingCount - minToppingCount + 1)) + minToppingCount;

  return Array.from({ length: toppingCount }, () => getRandomItem(toppingOptions));
}

function generateMenu() {
  return {
    baseMenu,
    riceAmount: getRandomItem(riceOptions),
    toppings: getRandomToppings(),
    createdAt: new Date(),
  };
}

function renderResult(menu) {
  const toppingItems = menu.toppings.map((topping) => `<li>${topping}</li>`).join("");

  resultCard.classList.remove("is-empty");
  resultCard.innerHTML = `
    <p class="result-title">本日のメニュー</p>
    <div class="menu-name">${menu.baseMenu}</div>
    <div class="rice-row">
      <span>ライス量</span>
      <strong>${menu.riceAmount}g</strong>
    </div>
    <div class="topping-heading">トッピング</div>
    <ul class="topping-list">${toppingItems}</ul>
  `;
}

function renderHistory() {
  clearHistoryButton.disabled = history.length === 0;

  if (history.length === 0) {
    historyList.innerHTML = '<li class="history-empty">まだ履歴はありません</li>';
    return;
  }

  historyList.innerHTML = history
    .map((menu) => {
      const time = new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(menu.createdAt);
      return `
        <li>
          <strong>${time} / ${menu.riceAmount}g</strong><br>
          ${menu.toppings.join("、")}
        </li>
      `;
    })
    .join("");
}

function spinRoulette() {
  latestMenu = generateMenu();
  history = [latestMenu, ...history].slice(0, maxHistoryCount);

  spinButton.classList.remove("is-spinning");
  window.requestAnimationFrame(() => {
    spinButton.classList.add("is-spinning");
  });

  renderResult(latestMenu);
  renderHistory();
  spinButton.textContent = "もう一度回す";
}

spinButton.addEventListener("click", spinRoulette);

clearHistoryButton.addEventListener("click", () => {
  history = [];
  renderHistory();
});
