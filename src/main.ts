import "./style.css";

// Counter state
let counter: number = 0;
const unitLabel = "hearts";

// Main container
const container = document.createElement("div");

container.innerHTML = `
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
`;

document.body.appendChild(container);

// Get elements
const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;

// Update display function
function updateCounter() {
  counter++;
  counterDisplay.textContent = `${counter} ${unitLabel}`;
}

// Increase when clicked
button.addEventListener("click", () => {
  updateCounter();
});

// Increase automatically every second
setInterval(() => {
  updateCounter();
}, 1000);
