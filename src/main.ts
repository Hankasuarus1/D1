import "./style.css";

let counter: number = 0;
const unitLabel = "hearts";

const gameUI = document.createElement("div");

gameUI.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
  <div id="rateDisplay">0.00 ${unitLabel}/sec</div>
  <div id="upgrades"></div>
`;

document.body.appendChild(gameUI);

// ===== Deep Sakura Blossom Pink Background =====
document.body.style.background =
  "linear-gradient(160deg, #d96a9b 0%, #c85085 40%, #a93b6d 100%)";
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "flex-start";

const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;
const rateDisplay = document.getElementById("rateDisplay") as HTMLDivElement;
const upgradesContainer = document.getElementById(
  "upgrades",
) as HTMLDivElement;

// ===== Layout & Styling =====

// Center layout on screen
gameUI.style.maxWidth = "600px";
gameUI.style.margin = "40px auto";
gameUI.style.display = "flex";
gameUI.style.flexDirection = "column";
gameUI.style.alignItems = "center";
gameUI.style.gap = "8px";
gameUI.style.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ===== HELLO KITTY PINK CLICK BUTTON =====
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

// Click feedback
button.addEventListener("mousedown", () => {
  button.style.transform = "scale(0.95)";
  button.style.boxShadow =
    "0 8px 16px rgba(255, 180, 210, 0.45), 0 2px 4px rgba(160, 60, 100, 0.2)";
});
button.addEventListener("mouseup", () => {
  button.style.transform = "scale(1)";
  button.style.boxShadow =
    "0 12px 22px rgba(255, 180, 210, 0.6), 0 4px 8px rgba(160, 60, 100, 0.25)";
});
button.addEventListener("mouseleave", () => {
  button.style.transform = "scale(1)";
  button.style.boxShadow =
    "0 12px 22px rgba(255, 180, 210, 0.6), 0 4px 8px rgba(160, 60, 100, 0.25)";
});

// ===== Display styling =====
counterDisplay.style.fontSize = "1.2rem";
counterDisplay.style.fontWeight = "600";
rateDisplay.style.fontSize = "0.95rem";
rateDisplay.style.opacity = "0.85";

// ===== Shop Title =====
const shopTitle = document.createElement("h2");
shopTitle.textContent = "Shop";
shopTitle.style.margin = "16px 0 8px 0";
shopTitle.style.fontSize = "1.3rem";
shopTitle.style.textAlign = "center";
shopTitle.style.color = "#ffeef5";
upgradesContainer.parentElement?.insertBefore(shopTitle, upgradesContainer);

// ===== Shop background =====
upgradesContainer.style.width = "100%";
upgradesContainer.style.padding = "12px 14px";
upgradesContainer.style.borderRadius = "10px";
upgradesContainer.style.border = "1px solid rgba(255, 220, 240, 0.3)";
upgradesContainer.style.background = "rgba(255, 240, 248, 0.2)";
upgradesContainer.style.boxShadow =
  "0 4px 10px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.05)";

// ===== Data-driven Items =====

interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

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
    description: "A soft ethereal glow that draws hearts like fireflies.",
  },
  {
    name: "Radiant Confidence",
    cost: 5000,
    rate: 200,
    description: "Walks into the room like the main character.",
  },
  {
    name: "Divine Sparkle",
    cost: 20000,
    rate: 1000,
    description: "Shines brilliantly, causing hearts to appear magically.",
  },
];

const PRICE_MULTIPLIER = 1.15;

type Upgrade = {
  item: Item;
  currentCost: number;
  count: number;
  button: HTMLButtonElement;
  countLabel: HTMLSpanElement;
};

let growthRatePerSecond = 0;

// ===== Build UI for all items (loop) =====
const upgrades: Upgrade[] = shopItems.map((item) => {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "flex-start";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.gap = "8px";
  wrapper.style.padding = "8px 0";
  wrapper.style.borderBottom = "1px dashed rgba(255,255,255,0.2)";

  const btn = document.createElement("button");
  btn.disabled = true;
  btn.style.flexShrink = "0";
  btn.style.padding = "6px 10px";
  btn.style.borderRadius = "8px";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "0.8rem";
  btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  btn.style.background = "#fcd0e0";

  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.flexDirection = "column";

  const countSpan = document.createElement("span");
  countSpan.style.fontSize = "0.85rem";
  countSpan.style.opacity = "0.8";
  countSpan.style.color = "#ffeef5";

  const descSpan = document.createElement("span");
  descSpan.textContent = item.description;
  descSpan.style.marginTop = "2px";
  descSpan.style.fontSize = "0.75rem";
  descSpan.style.opacity = "0.7";
  descSpan.style.fontStyle = "italic";
  descSpan.style.color = "#ffeef5";

  info.appendChild(countSpan);
  info.appendChild(descSpan);

  wrapper.appendChild(btn);
  wrapper.appendChild(info);
  upgradesContainer.appendChild(wrapper);

  const up: Upgrade = {
    item,
    currentCost: item.cost,
    count: 0,
    button: btn,
    countLabel: countSpan,
  };

  refreshUpgradeLabel(up);
  refreshUpgradeCount(up);

  return up;
});

// ===== Helpers =====

function updateDisplay() {
  counterDisplay.textContent = `${counter.toFixed(2)} ${unitLabel}`;
  rateDisplay.textContent = `${
    growthRatePerSecond.toFixed(2)
  } ${unitLabel}/sec`;
}

function updateUpgradeButtons() {
  for (const up of upgrades) {
    up.button.disabled = counter < up.currentCost;
    up.button.style.opacity = up.button.disabled ? "0.5" : "1";
  }
}

function refreshUpgradeLabel(up: Upgrade) {
  up.button.textContent = `Buy ${up.item.name} (+${up.item.rate}/sec) — ${
    up.currentCost.toFixed(
      2,
    )
  } hearts`;
}

function refreshUpgradeCount(up: Upgrade) {
  up.countLabel.textContent = `Owned: ${up.count}`;
}

// ===== Clicking =====
button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButtons();
});

// ===== Purchasing =====
for (const up of upgrades) {
  up.button.addEventListener("click", () => {
    if (counter >= up.currentCost) {
      counter -= up.currentCost;
      growthRatePerSecond += up.item.rate;
      up.count += 1;
      up.currentCost *= PRICE_MULTIPLIER;

      updateDisplay();
      refreshUpgradeCount(up);
      refreshUpgradeLabel(up);
      updateUpgradeButtons();
    }
  });
}

// ===== Auto-increment animation loop =====
let lastTimestamp: number | null = null;

function animate(timestamp: number) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  } else {
    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    const deltaSeconds = deltaMs / 1000;

    counter += growthRatePerSecond * deltaSeconds;
    updateDisplay();
    updateUpgradeButtons();
  }

  requestAnimationFrame(animate);
}

// Start loop
requestAnimationFrame(animate);
updateDisplay();
updateUpgradeButtons();
