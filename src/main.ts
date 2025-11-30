import "./style.css";

let counter: number = 0;
const unitLabel = "hearts";

const container = document.createElement("div");

container.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
`;

document.body.appendChild(container);

const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;

function updateDisplay() {
  counterDisplay.textContent = `${counter.toFixed(2)} ${unitLabel}`;
}

// Increase by 1 on click
button.addEventListener("click", () => {
  counter += 1;
  updateDisplay();
});

//Animation-based auto-increment
const ratePerSecond = 1;
let lastTimestamp: number | null = null;

function animate(timestamp: number) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  } else {
    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const deltaSeconds = deltaMs / 1000;

    // Grow counter based on real time elapsed
    counter += ratePerSecond * deltaSeconds;
    updateDisplay();
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
