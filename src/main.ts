import "./style.css";

// types
interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

type Upgrade = {
  item: Item;
  currentCost: number;
  count: number;
  button: HTMLButtonElement;
  countLabel: HTMLSpanElement;
};

// game values
const unitLabel = "hearts";
let counter: number = 0;
const PRICE_MULTIPLIER = 1.15;

// UI containers
const gameUI = document.createElement("div");
gameUI.id = "gameUI";

gameUI.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
  <div id="rateDisplay">0.00 ${unitLabel}/sec</div>
  <div id="upgrades"></div>
`;

// title
const title = document.createElement("h1");
title.textContent = "Heart Clicker Deluxe";

// add to page
document.body.appendChild(title);
document.body.appendChild(gameUI);

// page layout
document.body.style.background =
  "linear-gradient(160deg, #d96a9b 0%, #c85085 40%, #a93b6d 100%)";
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.alignItems = "center";
document.body.style.justifyContent = "flex-start";

// elements
const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;
const rateDisplay = document.getElementById("rateDisplay") as HTMLDivElement;
const upgradesContainer = document.getElementById("upgrades") as HTMLDivElement;

// layout
gameUI.style.maxWidth = "640px";
gameUI.style.width = "100%";
gameUI.style.marginTop = "24px";
gameUI.style.marginBottom = "32px";
gameUI.style.display = "flex";
gameUI.style.flexDirection = "column";
gameUI.style.alignItems = "center";
gameUI.style.gap = "12px";
gameUI.style.padding = "0 16px";
gameUI.style.boxSizing = "border-box";

// heart button styles
button.style.width = "160px";
button.style.height = "160px";
button.style.borderRadius = "50%";
button.style.fontSize = "3rem";
button.style.border = "none";
button.style.cursor = "pointer";
button.style.display = "flex";
button.style.alignItems = "center";
button.style.justifyContent = "center";
button.style.background =
  "radial-gradient(circle at 40% 35%, #ffeef5 0%, #ffd6e8 45%, #ffbddb 100%)";
button.style.boxShadow =
  "0 12px 22px rgba(255, 180, 210, 0.6), 0 4px 8px rgba(160, 60, 100, 0.25)";
button.style.transition = "box-shadow 0.1s ease";

// text styles
counterDisplay.style.fontSize = "1.2rem";
counterDisplay.style.fontWeight = "600";
rateDisplay.style.fontSize = "0.95rem";
rateDisplay.style.opacity = "0.85";

// shop title
const shopTitle = document.createElement("h2");
shopTitle.textContent = "Shop";
shopTitle.style.margin = "16px 0 8px 0";
shopTitle.style.fontSize = "1.3rem";
shopTitle.style.textAlign = "center";
upgradesContainer.parentElement!.insertBefore(shopTitle, upgradesContainer);

// shop box
upgradesContainer.style.width = "100%";
upgradesContainer.style.maxWidth = "640px";
upgradesContainer.style.padding = "12px 16px";
upgradesContainer.style.borderRadius = "16px";
upgradesContainer.style.border = "1px solid rgba(255, 220, 240, 0.3)";
upgradesContainer.style.background = "rgba(255, 240, 248, 0.25)";
upgradesContainer.style.boxShadow =
  "0 4px 10px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.05)";
upgradesContainer.style.boxSizing = "border-box";

// shop items
const shopItems: Item[] = [
  {
    name: "Increase Beauty",
    cost: 10,
    rate: 0.1,
    description: "A touch of blush that attracts a few extra hearts.",
  },
  {
    name: "Increase Personality",
    cost: 100,
    rate: 2,
    description: "Sharp wit and comfy vibes that win hearts over time.",
  },
  {
    name: "Increase Aura",
    cost: 1000,
    rate: 50,
    description: "Soft radiance that draws hearts like fireflies.",
  },
  {
    name: "Radiant Confidence",
    cost: 5000,
    rate: 200,
    description: "Main-character energy boosts heart production.",
  },
  {
    name: "Divine Sparkle",
    cost: 20000,
    rate: 1000,
    description: "Too shiny. Hearts appear magically in your presence.",
  },
];

let growthRatePerSecond = 0;

// build shop UI
const upgrades: Upgrade[] = shopItems.map((item) => {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "flex-start";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.gap = "12px";
  wrapper.style.padding = "8px 0";
  wrapper.style.borderBottom = "1px dashed rgba(255,255,255,0.25)";
  wrapper.style.width = "100%";

  const btn = document.createElement("button");
  btn.disabled = true;
  btn.style.padding = "8px 12px";
  btn.style.borderRadius = "10px";
  btn.style.background = "#fcd0e0";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "0.8rem";
  btn.style.minWidth = "260px";
  btn.style.textAlign = "left";

  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.flexDirection = "column";
  info.style.flex = "1";

  const countLabel = document.createElement("span");
  countLabel.style.fontSize = "0.85rem";
  countLabel.style.color = "#ffeef5";
  countLabel.style.opacity = "0.9";

  const desc = document.createElement("span");
  desc.textContent = item.description;
  desc.style.fontStyle = "italic";
  desc.style.fontSize = "0.75rem";
  desc.style.color = "#ffeef5";
  desc.style.opacity = "0.75";

  info.appendChild(countLabel);
  info.appendChild(desc);

  wrapper.appendChild(btn);
  wrapper.appendChild(info);
  upgradesContainer.appendChild(wrapper);

  const up: Upgrade = {
    item,
    currentCost: item.cost,
    count: 0,
    button: btn,
    countLabel,
  };

  refreshUpgradeLabel(up);
  refreshUpgradeCount(up);

  return up;
});

// display update
function updateDisplay() {
  counterDisplay.textContent = `${counter.toFixed(2)} ${unitLabel}`;
  rateDisplay.textContent = `${
    growthRatePerSecond.toFixed(2)
  } ${unitLabel}/sec`;
}

// button label update
function refreshUpgradeLabel(up: Upgrade) {
  up.button.textContent = `Buy ${up.item.name} — ${
    up.currentCost.toFixed(2)
  } hearts (+${up.item.rate}/sec)`;
}

// count update
function refreshUpgradeCount(up: Upgrade) {
  up.countLabel.textContent = `Owned: ${up.count}`;
}

// enable/disable buy buttons
function updateUpgradeButtons() {
  for (const up of upgrades) {
    up.button.disabled = counter < up.currentCost;
    up.button.style.opacity = up.button.disabled ? "0.5" : "1";
  }
}

// clicking the heart
button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButtons();

  button.classList.remove("heart-pulse");
  void button.offsetWidth;
  button.classList.add("heart-pulse");
});

// purchasing
for (const up of upgrades) {
  up.button.addEventListener("click", () => {
    if (counter >= up.currentCost) {
      counter -= up.currentCost;
      up.count += 1;
      growthRatePerSecond += up.item.rate;
      up.currentCost *= PRICE_MULTIPLIER;

      refreshUpgradeLabel(up);
      refreshUpgradeCount(up);
      updateDisplay();
      updateUpgradeButtons();
    }
  });
}

// auto-increment loop
let lastTimestamp: number | null = null;

function animate(t: number) {
  if (lastTimestamp != null) {
    const delta = (t - lastTimestamp) / 1000;
    counter += growthRatePerSecond * delta;
  }
  lastTimestamp = t;

  updateDisplay();
  updateUpgradeButtons();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
