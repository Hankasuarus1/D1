import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

let counter: number = 0;
const unitLabel = "hearts";

const container = document.createElement("div");

container.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
  <button id="myButton">❤️</button>
  <div id="counterDisplay">0 ${unitLabel}</div>
`;

document.body.appendChild(container);

//Button setup
const button = document.getElementById("myButton") as HTMLButtonElement;
const counterDisplay = document.getElementById(
  "counterDisplay",
) as HTMLDivElement;

button.addEventListener("click", () => {
  counter++;
  counterDisplay.textContent = `${counter} ${unitLabel}`;
});
