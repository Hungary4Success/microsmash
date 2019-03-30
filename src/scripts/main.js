import "./external/dap.bundle.js";
import "./external/pixi.min.js";
import { connectToDevice } from "./input.js";

import { GameObject } from "./game-engine.js";

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

window.deadAnimation = "animation/tejasidle.json";
window.aThing = new GameObject(app.stage);
aThing.addAnimation(deadAnimation, () => {
  aThing.setPosition(deadAnimation, 0, 0);
  aThing.setScale(deadAnimation, 0.2);
});

document.body.addEventListener("click", () => {
  window.aThing.playAnimation(deadAnimation, false);
});

document.getElementById("connectButton").addEventListener("click", connectToDevice);
