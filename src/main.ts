import "./style.css";

let counter: number = 0;
const unitLabel = "hearts";

const container = document.createElement("div");

container.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
  <div id="rateDisplay">0.00 ${unitLabel}/sec</div>
  <div id="upgrades"></div>
`;

document.body.appendChild(container);

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
container.style.maxWidth = "600px";
container.style.margin = "40px auto";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.alignItems = "center";
container.style.gap = "8px";
container.style.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// --------- HELLO KITTY PINK BUTTON ---------
button.style.width = "160px";
button.style.height = "160px";
button.style.borderRadius = "50%";
button.style.fontSize = "3rem";
button.style.border = "none";
button.style.cursor = "pointer";
button.style.display = "flex";
button.style.alignItems = "center";
button.style.justifyContent = "center";

/* Hello Kitty soft pastel pink */
button.style.background =
  "radial-gradient(circle at 40% 35%, #ffeef5 0%, #ffd6e8 45%, #ffbddb 100%)";

button.style.boxShadow =
  "0 12px 22px rgba(255, 180, 210, 0.45), 0 4px 8px rgba(255, 140, 180, 0.25)";
button.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";

// Click feedback
button.addEventListener("mousedown", () => {
  button.style.transform = "scale(0.95)";
  button.style.boxShadow =
    "0 8px 16px rgba(255, 180, 210, 0.4), 0 2px 4px rgba(255, 140, 180, 0.2)";
});
button.addEventListener("mouseup", () => {
  button.style.transform = "scale(1)";
  button.style.boxShadow =
    "0 12px 22px rgba(255, 180, 210, 0.45), 0 4px 8px rgba(255, 140, 180, 0.25)";
});
button.addEventListener("mouseleave", () => {
  button.style.transform = "scale(1)";
  button.style.boxShadow =
    "0 12px 22px rgba(255, 180, 210, 0.45), 0 4px 8px rgba(255, 140, 180, 0.25)";
});

// -------- More visual tweaks --------
counterDisplay.style.fontSize = "1.2rem";
counterDisplay.style.fontWeight = "600";
rateDisplay.style.fontSize = "0.95rem";
rateDisplay.style.opacity = "0.8";

// Style upgrades section as a simple shop
const shopTitle = document.createElement("h2");
shopTitle.textContent = "Shop";
shopTitle.style.margin = "16px 0 8px 0";
shopTitle.style.fontSize = "1.3rem";
shopTitle.style.textAlign = "center";
upgradesContainer.parentElement?.insertBefore(shopTitle, upgradesContainer);

upgradesContainer.style.width = "100%";
upgradesContainer.style.padding = "12px 14px";
upgradesContainer.style.borderRadius = "10px";
upgradesContainer.style.border = "1px solid rgba(0,0,0,0.1)";
upgradesContainer.style.background = "rgba(255,255,255,0.85)";
upgradesContainer.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";

// ===== Data-driven items (Step 9) =====

interface Item {
  name: string;
  cost: number;
  rate: number;
}

// You can rename cost/rate if you want, but this matches the suggested API.
const availableItems: Item[] = [
  { name: "Increase Beauty", cost: 10, rate: 0.1 },
  { name: "Increase Personality", cost: 100, rate: 2 },
  { name: "Increase Aura", cost: 1000, rate: 50 },
];

const PRICE_MULTIPLIER = 1.15;

// Represent a *purchased/interactive* item in the UI
type Upgrade = {
  item: Item;
  currentCost: number;
  count: number;
  button: HTMLButtonElement;
  countLabel: HTMLSpanElement;
};

let growthRatePerSecond = 0;

// Build upgrades UI purely from availableItems (loop, no hard-coded A/B/C)
const upgrades: Upgrade[] = availableItems.map((item) => {
  const wrapper = document.createElement("div");

  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.gap = "8px";
  wrapper.style.padding = "6px 0";
  wrapper.style.borderBottom = "1px dashed rgba(0,0,0,0.1)";

  const btn = document.createElement("button");
  btn.disabled = true;

  // style upgrade button
  btn.style.flexShrink = "0";
  btn.style.padding = "6px 10px";
  btn.style.borderRadius = "8px";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "0.8rem";
  btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
  btn.style.background = "#ffe4f0";

  const countSpan = document.createElement("span");
  countSpan.style.marginLeft = "8px";
  countSpan.style.fontSize = "0.85rem";
  countSpan.style.opacity = "0.75";

  wrapper.appendChild(btn);
  wrapper.appendChild(countSpan);
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
  up.button.textContent =
    `Buy ${up.item.name}: +${up.item.rate} ${unitLabel}/sec (cost: ${
      up.currentCost.toFixed(
        2,
      )
    } ${unitLabel})`;
}

function refreshUpgradeCount(up: Upgrade) {
  up.countLabel.textContent = `Owned: ${up.count}`;
}

function updateUpgradeCounts() {
  for (const up of upgrades) {
    refreshUpgradeCount(up);
  }
}

// ===== Manual click =====
button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButtons();
});

// ===== Upgrade purchasing (loop-based) =====
for (const up of upgrades) {
  up.button.addEventListener("click", () => {
    if (counter >= up.currentCost) {
      counter -= up.currentCost;
      growthRatePerSecond += up.item.rate;
      up.count += 1;

      // price scales by 15% each time
      up.currentCost *= PRICE_MULTIPLIER;

      updateDisplay();
      refreshUpgradeCount(up);
      refreshUpgradeLabel(up);
      updateUpgradeButtons();
    }
  });
}

// ===== Animation-based auto-increment =====
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

// Start
requestAnimationFrame(animate);
updateDisplay();
updateUpgradeCounts();
updateUpgradeButtons();
