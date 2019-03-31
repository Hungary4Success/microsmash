import "./external/pixi.min.js";

import { UserAction, addControllerObserver } from "./input.js";

import { Player } from "./game-engine.js";

const playerTwoHealth = 100;

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

const idleAnim = "animation/tejasidle.json";
const attackAnim = "animation/tejasattack.json";
const runAnim = "animation/tejasrun.json";
const deadAnim = "animation/tejasdead.json";

const allAnimations = [idleAnim, attackAnim, runAnim, deadAnim];

const player1Animations = {
  attack: attackAnim,
  idle: idleAnim,
  run: runAnim,
  dead: deadAnim
};

let players = [];

PIXI.loader.add(allAnimations).load(appStart);

function appStart() {
  // Set background
  const background = PIXI.Texture.fromImage("animation/background.webp");
  app.stage.addChild(new PIXI.Sprite(background));

  addControllerObserver((controller) => {
    const newPlayer = new Player(controller, app, player1Animations, players.length > 0 ? 462 : 50);

    controller.addActionListener(UserAction.RIGHT, newPlayer.rightHandler);
    controller.addActionListener(UserAction.RIGHT, newPlayer.rightHandler);
    controller.addActionListener(UserAction.LEFT, newPlayer.leftHandler);
    controller.addActionListener(UserAction.ATTACK, newPlayer.attackHandler);
    controller.addActionListener(UserAction.DEFENSE, () => {
      console.log("DEFENSE");
    });
    controller.addActionListener(UserAction.JUMP, () => {
      console.log("JUMP");
    });

    players.push(newPlayer);

    if (players.length === 1) {
      document.getElementById("connectedPlayers").children[0].style = "display: block";
    } else {
      document.getElementById("connectedPlayers").children[1].style = "display: block";

      // Start main loop
      app.ticker.add(delta => mainLoop(delta));
    }
  }, (controllerId) => {
    players = players.filter(player => player.controller.device.serialNumber !== controllerId);
  });
}

function drawLeftHealthBar() {
  // Create the health bar
  const healthBar = new PIXI.Container();
  healthBar.position.set(players[0].getWidth() - 90, 12);
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
  outerBar.drawRect(0, 0, players[0].health * 2, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function drawRightHealthBar() {
  // Create the health bar
  const healthBar = new PIXI.Container();
  healthBar.position.set(players[0].getWidth() + 200, 12);
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
  // Collision detection
  players.forEach(function (player) {
    players.forEach(function(otherPlayer) {
      if (player === otherPlayer) {
        return;
      }

      let halfWidth = player.getWidth() / 2 - player.getWidth() / 5;
      let futureXPlayer = player.posX + player.speedX + player.velocityX;

      player.isCollision = Math.abs(futureXPlayer - otherPlayer.posX) < halfWidth;
      player.collisionPartner = otherPlayer;

      if (player.isCollision) {
        player.collisionSide = futureXPlayer < otherPlayer.posX ? "right" : "left";
      }

    });

    // Collison reaction
    if (player.isCollision) {
      switch(player.collisionSide) {
        case "right": 
          player.speedX = -5;
          player.velocityX = 1;
          player.freezeOrientation = true;
          player.collisionPartner.speedX = 5;
          player.collisionPartner.velocityX = -1;
          player.collisionPartner.freezeOrientation = true;
          break;
        case "left":
          player.speedX = 5;
          player.velocityX = -1;
          player.freezeOrientation = true;
          player.collisionPartner.speedX = -5;
          player.collisionPartner.velocityX = 1;
          player.collisionPartner.freezeOrientation = true;
          break;
      }
    }

    // Movement
    player.speedX += player.velocityX
    player.reduceVelocity(Math.abs(player.velocityX / 5));
    //dif (player.velocityX === 0) {
      //player.freezeOrientation = false;
    //}

    player.moveX(player.speedX);
  });

  drawLeftHealthBar();
  drawRightHealthBar();
}
