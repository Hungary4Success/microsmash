import "./external/dap.bundle.js";
import "./external/pixi.min.js";
import { connectToDevice } from "./input.js";

import { GameObject } from "./game-engine.js";
import { registerHandler, UserAction } from "./input.js";

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);
app.ticker.add(delta => mainLoop(delta));

const idleAnim = "animation/tejasidle.json";
const attackAnim = "animation/tejasattack.json";
const allAnimations = [idleAnim, attackAnim];
PIXI.loader.add(allAnimations).load(appStart);

function appStart() {
  window.aThing = new GameObject(app.stage);
  aThing.addAnimation(attackAnim);
  aThing.addAnimation(idleAnim);
  aThing.setScale(0.5);
  aThing.setPosition(aThing.getWidth() / 2, 512);
  aThing.playAnimation(idleAnim, true);

document.getElementById("connectButton").addEventListener("click", connectToDevice);
