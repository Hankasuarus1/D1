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

//Upgrade setup

type Upgrade = {
  id: string;
  name: string;
  cost: number;
  rate: number;
  count: number;
  button: HTMLButtonElement;
  countLabel: HTMLSpanElement;
};

const upgradeConfigs = [
  { id: "A", name: "A", cost: 10, rate: 0.1 },
  { id: "B", name: "B", cost: 100, rate: 2.0 },
  { id: "C", name: "C", cost: 1000, rate: 50.0 },
];

const PRICE_MULTIPLIER = 1.15;

let growthRatePerSecond = 0;

const upgrades: Upgrade[] = upgradeConfigs.map((cfg) => {
  const wrapper = document.createElement("div");

  const btn = document.createElement("button");
  btn.id = `upgrade-${cfg.id}`;
  btn.disabled = true;

  const countSpan = document.createElement("span");
  countSpan.id = `upgrade-${cfg.id}-count`;
  countSpan.style.marginLeft = "8px";

  wrapper.appendChild(btn);
  wrapper.appendChild(countSpan);
  upgradesContainer.appendChild(wrapper);

  const up: Upgrade = {
    id: cfg.id,
    name: cfg.name,
    cost: cfg.cost,
    rate: cfg.rate,
    count: 0,
    button: btn,
    countLabel: countSpan,
  };

  refreshUpgradeLabel(up);
  refreshUpgradeCount(up);

  return up;
});

//Display helpers

function updateDisplay() {
  counterDisplay.textContent = `${counter.toFixed(2)} ${unitLabel}`;
  rateDisplay.textContent = `${
    growthRatePerSecond.toFixed(2)
  } ${unitLabel}/sec`;
}

function updateUpgradeButtons() {
  for (const up of upgrades) {
    up.button.disabled = counter < up.cost;
  }
}

function refreshUpgradeLabel(up: Upgrade) {
  up.button.textContent =
    `Buy ${up.name}: +${up.rate} ${unitLabel}/sec (cost: ${
      up.cost.toFixed(
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

//Manual click

button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButtons();
});

//Upgrade purchasing

for (const up of upgrades) {
  up.button.addEventListener("click", () => {
    if (counter >= up.cost) {
      counter -= up.cost;
      growthRatePerSecond += up.rate;
      up.count += 1;
      up.cost *= PRICE_MULTIPLIER;
      // Refresh UI
      updateDisplay();
      refreshUpgradeCount(up);
      refreshUpgradeLabel(up);
      updateUpgradeButtons();
    }
  });
}

//Animation-based auto-increment

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

// Start loopinitial UI
requestAnimationFrame(animate);
updateDisplay();
updateUpgradeCounts();
updateUpgradeButtons();
