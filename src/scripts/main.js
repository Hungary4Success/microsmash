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

  app.ticker.add(delta => mainLoop(delta));
}

function drawLeftHealthBar() {
  //Create the health bar
  let healthBar = new PIXI.Container();
  healthBar.position.set(window.aThing.getWidth() - 190, 12)
  app.stage.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0xFF3300);
  innerBar.drawRect(0, 0, 200, 12);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0x33FF00);
  outerBar.drawRect(0, 0, 150, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function mainLoop(delta) {
  drawLeftHealthBar();
}
