import "./external/pixi.min.js";

import { Controller, UserAction, addControllerObserver } from "./input.js";

import { Player } from "./game-engine.js";

const debug = false;

const playerTwoHealth = 100;

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

const idleAnim1 = "animation/tejasidle.json";
const attackAnim1 = "animation/tejasattack.json";
const runAnim1 = "animation/tejasrun.json";
const jumpAnim1 = "animation/tejsjump.json";
const deadAnim1 = "animation/tejasdead.json";

const idleAnim2 = "animation/alidle.json";
const attackAnim2 = "animation/alattack.json";
const runAnim2 = "animation/alrun.json";
const jumpAnim2 = "animation/aljump.json";
const deadAnim2 = "animation/tejasdead.json";


const allAnimations = [idleAnim1, attackAnim1, runAnim1, deadAnim1, jumpAnim1,
  idleAnim2, attackAnim2, runAnim2, /* deadAnim2, */ jumpAnim2];

const player1Animations = {
  attack: attackAnim1,
  idle: idleAnim1,
  run: runAnim1,
  dead: deadAnim1,
  jump: jumpAnim1
};

const player2Animations = {
  attack: attackAnim2,
  idle: idleAnim2,
  run: runAnim2,
  dead: deadAnim2,
  jump: jumpAnim2
};

let players = [];

PIXI.loader.add(allAnimations).load(appStart);

// Adds handlers for a player with given controller
function addHandlers(controller, thisPlayer) {
  controller.addActionListener(UserAction.RIGHT, thisPlayer.rightHandler);
  controller.addActionListener(UserAction.LEFT, thisPlayer.leftHandler);
  controller.addActionListener(UserAction.JUMP, thisPlayer.jumpHandler);
  controller.addActionListener(UserAction.ATTACK, thisPlayer.attackHandler);
  controller.addActionListener(UserAction.DEFENSE, thisPlayer.defendHandler);
}

function appStart() {
  // Set background
  const background = PIXI.Texture.fromImage("animation/background.webp");
  app.stage.addChild(new PIXI.Sprite(background));

  if (debug) {
    var controller = new Controller();
    const firstPlayer = new Player(controller, app, player1Animations, players.length > 0 ? 462 : 50);
    addHandlers(controller, firstPlayer);
    players.push(firstPlayer);
    var controller = new Controller();
    const secondPlayer = new Player(controller, app, player2Animations, players.length > 0 ? 462 : 50);
    addHandlers(controller, secondPlayer);
    players.push(secondPlayer);
    app.ticker.add(delta => mainLoop(delta));
  }

  addControllerObserver(async (controller) => {
    const newPlayer = new Player(controller, app, players.length === 0 ? player1Animations : player2Animations, players.length > 0 ? 462 : 50);
    addHandlers(controller, newPlayer);
    await controller.connectAsync();

    players.push(newPlayer);

    if (players.length === 1) {
      document.getElementById("connectedPlayers").children[0].style = "display: block";
    } else if (players.length === 2) {
      document.getElementById("connectedPlayers").children[1].style = "display: block";

      // Start main loop
      app.ticker.add(delta => mainLoop(delta));
    }
  }, (controllerId) => {
    players = players.filter(player => player.controller.device.serialNumber !== controllerId);

    if (players.length === 1) {
      document.getElementById("connectedPlayers").children[1].style = "";
    } else {
      document.getElementById("connectedPlayers").children[0].style = "";

      // Start main loop
      app.ticker.add(delta => mainLoop(delta));
    }
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
  outerBar.drawRect((100 - players[1].health) * 2, 0, 200 - (100 - players[1].health) * 2, 12);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;
}

function mainLoop() {
  // Collision detection
  players.forEach((player) => {
    players.forEach((otherPlayer) => {
      if (player === otherPlayer) {
        return;
      }

      const halfWidth = player.getWidth() / 2 - player.getWidth() / 5;
      const futureXPlayer = player.posX + player.speedX + player.velocityX;

      player.isCollision = Math.abs(futureXPlayer - otherPlayer.posX) < halfWidth;
      player.isCollision &= Math.abs(player.posY - otherPlayer.posY) < player.getHeight();
      player.collisionPartner = otherPlayer;

      if (player.isCollision) {
        player.collisionSide = futureXPlayer < otherPlayer.posX ? "right" : "left";
      }

      let canHit = Math.abs(otherPlayer.posX - player.posX) < player.getWidth();
      canHit &= Math.abs(player.posY - otherPlayer.posY) < player.getHeight();
      player.rightHitTarget = (canHit && otherPlayer.posX > player.posX) ? otherPlayer : null;

      player.leftHitTarget = (canHit && otherPlayer.posX < player.posX) ? otherPlayer : null;
    });

    // Collison reaction
    if (player.isCollision) {
      switch (player.collisionSide) {
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
        default:
          break;
      }
    }

    // Movement
    player.speedX += player.velocityX;

    // Jump
    if (player.jumping && player.speedY < player.jumpheight - 1) { player.speedY += 1; } else if (player.jumping && player.speedY == player.jumpheight - 1) {
      player.jumping = false;
      player.speedY = 0;
    }

    player.reduceVelocity(Math.abs(player.velocityX / 5));

    player.moveY(player.speedY);
    player.moveX(player.speedX);
  });

  drawLeftHealthBar();
  drawRightHealthBar();
}
