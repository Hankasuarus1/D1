import "./style.css";

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

// CONSTANTS

const unitLabel = "hearts";
let counter: number = 0;
const PRICE_MULTIPLIER = 1.15;

// ROOT UI CREATION

const gameUI = document.createElement("div");

gameUI.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
  <div id="rateDisplay">0.00 ${unitLabel}/sec</div>
  <div id="upgrades"></div>
`;

document.body.appendChild(gameUI);

// BACKGROUND

document.body.style.background =
  "linear-gradient(160deg, #d96a9b 0%, #c85085 40%, #a93b6d 100%)";
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "flex-start";

// DOM REFERENCES

const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;
const rateDisplay = document.getElementById("rateDisplay") as HTMLDivElement;
const upgradesContainer = document.getElementById("upgrades") as HTMLDivElement;

// UI LAYOUT STYLING

gameUI.style.maxWidth = "600px";
gameUI.style.margin = "40px auto";
gameUI.style.display = "flex";
gameUI.style.flexDirection = "column";
gameUI.style.alignItems = "center";
gameUI.style.gap = "8px";
gameUI.style.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// CLICK BUTTON

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
button.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";

// click feedback
button.addEventListener("mousedown", () => {
  button.style.transform = "scale(0.95)";
});
button.addEventListener("mouseup", () => {
  button.style.transform = "scale(1)";
});
button.addEventListener("mouseleave", () => {
  button.style.transform = "scale(1)";
});

//  SHOP TITLE + SHOP UI CARD

counterDisplay.style.fontSize = "1.2rem";
counterDisplay.style.fontWeight = "600";

rateDisplay.style.fontSize = "0.95rem";
rateDisplay.style.opacity = "0.85";

const shopTitle = document.createElement("h2");
shopTitle.textContent = "Shop";
shopTitle.style.margin = "16px 0 8px 0";
shopTitle.style.fontSize = "1.3rem";
shopTitle.style.textAlign = "center";
shopTitle.style.color = "#ffeef5";
upgradesContainer.parentElement!.insertBefore(shopTitle, upgradesContainer);

upgradesContainer.style.width = "100%";
upgradesContainer.style.padding = "12px 14px";
upgradesContainer.style.borderRadius = "10px";
upgradesContainer.style.border = "1px solid rgba(255, 220, 240, 0.3)";
upgradesContainer.style.background = "rgba(255, 240, 248, 0.2)";
upgradesContainer.style.boxShadow =
  "0 4px 10px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.05)";

//  SHOP DATA

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

// BUILD SHOP UI

let growthRatePerSecond = 0;

const upgrades: Upgrade[] = shopItems.map((item) => {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "flex-start";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.gap = "8px";
  wrapper.style.padding = "8px 0";
  wrapper.style.borderBottom = "1px dashed rgba(255,255,255,0.25)";

  const btn = document.createElement("button");
  btn.disabled = true;
  btn.style.padding = "6px 10px";
  btn.style.borderRadius = "8px";
  btn.style.background = "#fcd0e0";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "0.8rem";

  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.flexDirection = "column";

  const countLabel = document.createElement("span");
  countLabel.style.fontSize = "0.85rem";
  countLabel.style.color = "#ffeef5";
  countLabel.style.opacity = "0.85";

  const desc = document.createElement("span");
  desc.textContent = item.description;
  desc.style.fontStyle = "italic";
  desc.style.fontSize = "0.75rem";
  desc.style.color = "#ffeef5";
  desc.style.opacity = "0.7";

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

// HELPERS

function updateDisplay() {
  counterDisplay.textContent = `${counter.toFixed(2)} hearts`;
  rateDisplay.textContent = `${growthRatePerSecond.toFixed(2)} hearts/sec`;
}

function refreshUpgradeLabel(up: Upgrade) {
  up.button.textContent = `Buy ${up.item.name} — ${
    up.currentCost.toFixed(2)
  } hearts (+${up.item.rate}/sec)`;
}

function refreshUpgradeCount(up: Upgrade) {
  up.countLabel.textContent = `Owned: ${up.count}`;
}

function updateUpgradeButtons() {
  for (const up of upgrades) {
    up.button.disabled = counter < up.currentCost;
    up.button.style.opacity = up.button.disabled ? "0.5" : "1";
  }
}

// CLICKING

button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButtons();
});

// PURCHASING

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

let lastTimestamp: number | null = null;

function animate(ts: number) {
  if (lastTimestamp != null) {
    const delta = (ts - lastTimestamp) / 1000;
    counter += growthRatePerSecond * delta;
  }
  lastTimestamp = ts;

  updateDisplay();
  updateUpgradeButtons();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
