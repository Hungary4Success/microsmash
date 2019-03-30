import "./external/dap.bundle.js";
import "./external/pixi.min.js";
import { connectToDevice } from "./input.js";

import { GameObject } from "./game-engine.js";
import { registerHandler, UserAction } from "./input.js";

let playerOneHealth = 70;
let playerTwoHealth = 60;

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

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

  registerHandler(UserAction.LEFT, function() {
    console.log("LEFT");
    aThing.moveX(-5);
  });

  registerHandler(UserAction.ATTACK, function() {
    console.log("ATTACK");
    aThing.playAnimation(attackAnim, false, function() {
      aThing.playAnimation(idleAnim, true);
    });
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
  healthBar.position.set(window.aThing.getWidth() - 90, 12)
  app.stage.addChild(healthBar);

  //Create the red background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0xFF3300);
  innerBar.drawRect(0, 0, 200, 12);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front green rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0x33FF00);
  outerBar.drawRect(0, 0, playerOneHealth * 2, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function drawRightHealthBar() {
  //Create the health bar
  let healthBar = new PIXI.Container();
  healthBar.position.set(window.aThing.getWidth() + 200, 12)
  app.stage.addChild(healthBar);

  //Create the red background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0xFF3300);
  innerBar.drawRect(0, 0, 200, 12);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front green rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0x33FF00);
  outerBar.drawRect((100 - playerTwoHealth) * 2, 0, 200, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function mainLoop(delta) {
  drawLeftHealthBar();
  drawRightHealthBar();
}
