import "./external/pixi.min.js";

import { Controller, UserAction, addControllerObserver } from "./input.js";

import { Player } from "./game-engine.js";

const playerTwoHealth = 100;

document.getElementById("connectButton").addEventListener("click", connectToDevice);

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

const idleAnim = "animation/tejasidle.json";
const attackAnim = "animation/tejasattack.json";
const runAnim = "animation/tejasrun.json";
const deadAnim = "animation/tejasdead.json"

const allAnimations = [idleAnim, attackAnim, runAnim, deadAnim];

const player1Animations = { 
  attack: attackAnim, 
  idle: idleAnim, 
  run: runAnim,
  dead: deadAnim 
};

var players = [];

PIXI.loader.add(allAnimations).load(appStart);

function appStart() {
  // Set background
  const background = PIXI.Texture.fromImage("animation/background.webp");
  app.stage.addChild(new PIXI.Sprite(background));

  /* --Player 1-- */
  window.player1 = new Player(app, player1Animations, 50);
  window.player1.playAnimation(idleAnim, true);

  // registerHandler(UserAction.RIGHT, window.player1.rightHandler);
  // registerHandler(UserAction.LEFT, window.player1.leftHandler);
  // registerHandler(UserAction.ATTACK, window.player1.attackHandler);
  // registerHandler(UserAction.DEFENSE, () => {
  //   console.log("DEFENSE");
  // });
  // registerHandler(UserAction.JUMP, () => {
  //   console.log("JUMP");
  // });
  addControllerObserver((controller) => {
    console.log("added:", controller.device);
  }, (controllerId) => {
    console.log("removed", controllerId);
  });

  players.push(player1);

  /* --Player 2-- */
  window.player2 = new Player(app, player1Animations, 462);
  window.player2.playAnimation(idleAnim, true);


  players.push(player2);

  // Start main loop
  app.ticker.add(delta => mainLoop(delta));
}

function drawLeftHealthBar() {
  // Create the health bar
  const healthBar = new PIXI.Container();
  healthBar.position.set(window.player1.getWidth() - 90, 12);
  app.stage.addChild(healthBar);

  // Create the red background rectangle
  const innerBar = new PIXI.Graphics();
  innerBar.beginFill(0xFF3300);
  innerBar.drawRect(0, 0, 200, 12);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front green rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0x33FF00);
  outerBar.drawRect(0, 0, window.player1.health * 2, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function drawRightHealthBar() {
  // Create the health bar
  const healthBar = new PIXI.Container();
  healthBar.position.set(window.player1.getWidth() + 200, 12);
  app.stage.addChild(healthBar);

  // Create the red background rectangle
  const innerBar = new PIXI.Graphics();
  innerBar.beginFill(0xFF3300);
  innerBar.drawRect(0, 0, 200, 12);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  // Create the front green rectangle
  const outerBar = new PIXI.Graphics();
  outerBar.beginFill(0x33FF00);
  outerBar.drawRect((100 - playerTwoHealth) * 2, 0, 200 - (100 - playerTwoHealth) * 2, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function mainLoop() {
  if (window.player1.velocityX !== 0) {
    window.player1.moveX(window.player1.velocityX);
    window.player1.reduceVelocity(1);
  }
  drawLeftHealthBar();
  drawRightHealthBar();
}
