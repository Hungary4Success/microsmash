import "./external/dap.bundle.js";
import "./external/pixi.min.js";
import "./input.js";
import "./connect.js";
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
const allAnimations = [idleAnim];
PIXI.loader.add(allAnimations).load(appStart);

function appStart() {
  window.aThing = new GameObject(app.stage);
  aThing.addAnimation(idleAnim)
  aThing.setPosition(aThing.getWidth() / 2, 512);
  aThing.setScale(idleAnim, 1);
  aThing.playAnimation(idleAnim, true);

  registerHandler(UserAction.RIGHT, function() {
    console.log("RIGHT");
    aThing.moveX(5);
  });

  registerHandler(UserAction.LEFT, function() {
    console.log("LEFT");
    aThing.moveX(-5);
  });

  registerHandler(UserAction.ATTACK, function() {
    console.log("ATTACK");
  });

  registerHandler(UserAction.DEFENSE, function() {
    console.log("DEFENSE");
  });

  registerHandler(UserAction.JUMP, function() {
    console.log("JUMP");
  });
}


function mainLoop(delta) {
  //aThing.moveX(1 + delta);
}
