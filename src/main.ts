import "./style.css";

let counter: number = 0;
const unitLabel = "hearts";

const container = document.createElement("div");

container.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
  <button id="upgradeButton" disabled>
    Buy +1 ❤️/sec (10 ${unitLabel})
  </button>
`;

document.body.appendChild(container);

const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;
const upgradeButton = document.getElementById(
  "upgradeButton",
) as HTMLButtonElement;

let growthRatePerSecond = 0;
const UPGRADE_COST = 10;

function updateDisplay() {
  counterDisplay.textContent = `${counter.toFixed(2)} ${unitLabel}`;
}

function updateUpgradeButton() {
  upgradeButton.disabled = counter < UPGRADE_COST;
}

button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
  updateUpgradeButton();
});

// Buy upgrade: -10 hearts, +1 heart/sec
upgradeButton.addEventListener("click", () => {
  if (counter >= UPGRADE_COST) {
    counter -= UPGRADE_COST;
    growthRatePerSecond += 1;
    updateDisplay();
    updateUpgradeButton();
  }
});

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
    updateUpgradeButton();
  }

  requestAnimationFrame(animate);
}

// Start loop
requestAnimationFrame(animate);
