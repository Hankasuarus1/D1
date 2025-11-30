import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

const container = document.createElement("div");

container.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
  <button id="myButton">❤️</button>
`;

// Add to page
document.body.appendChild(container);

// Get reference to button
const button = document.getElementById("myButton") as HTMLButtonElement;

// Add event listener
button.addEventListener("click", () => {
  alert("Button was clicked!");
});
