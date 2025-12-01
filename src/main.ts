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

type Upgrade = {
  id: string;
  name: string;
  cost: number;
  rate: number; // units per second
  count: number;
  button: HTMLButtonElement;
  countLabel: HTMLSpanElement;
};

const upgradeConfigs = [
  { id: "A", name: "Increase Beauty", cost: 10, rate: 0.1 },
  { id: "B", name: "Increase Personality", cost: 100, rate: 2.0 },
  { id: "C", name: "Valentines Aura", cost: 1000, rate: 50.0 },
];

let growthRatePerSecond = 0;

const upgrades: Upgrade[] = upgradeConfigs.map((cfg) => {
  const wrapper = document.createElement("div");

  const btn = document.createElement("button");
  btn.id = `upgrade-${cfg.id}`;
  btn.disabled = true;
  btn.textContent =
    `Buy ${cfg.name}: +${cfg.rate} ${unitLabel}/sec (cost: ${cfg.cost} ${unitLabel})`;

  const countSpan = document.createElement("span");
  countSpan.id = `upgrade-${cfg.id}-count`;
  countSpan.style.marginLeft = "8px";
  countSpan.textContent = "Owned: 0";

  wrapper.appendChild(btn);
  wrapper.appendChild(countSpan);
  upgradesContainer.appendChild(wrapper);

  return {
    id: cfg.id,
    name: cfg.name,
    cost: cfg.cost,
    rate: cfg.rate,
    count: 0,
    button: btn,
    countLabel: countSpan,
  };
});

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

function updateUpgradeCounts() {
  for (const up of upgrades) {
    up.countLabel.textContent = `Owned: ${up.count}`;
  }
}

button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButtons();
});

for (const up of upgrades) {
  up.button.addEventListener("click", () => {
    if (counter >= up.cost) {
      counter -= up.cost;
      growthRatePerSecond += up.rate;
      up.count += 1;
      updateDisplay();
      updateUpgradeCounts();
      updateUpgradeButtons();
    }
  });
}

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

// Initial display
updateDisplay();
updateUpgradeCounts();
updateUpgradeButtons();
