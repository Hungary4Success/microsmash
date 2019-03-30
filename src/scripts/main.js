import "./external/pixi.min.js";
import { GameObject } from "./game-engine.js";
import { registerHandler, UserAction } from "./input.js";

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);
app.ticker.add(delta => mainLoop(delta));

const deadAnimation = "animation/spritesheet.json";
const allAnimations = [deadAnimation];
PIXI.loader.add(allAnimations).load(appStart);

function appStart() {
  window.aThing = new GameObject(app.stage);
  aThing.addAnimation(deadAnimation)
  aThing.setPosition(0, 522);
  aThing.setScale(deadAnimation, 0.2);
  aThing.playAnimation(deadAnimation, true);

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