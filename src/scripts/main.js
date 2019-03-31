import "./external/pixi.min.js";

import { UserAction, addControllerObserver, Controller } from "./input.js";

import { Player } from "./game-engine.js";

const debug = true;

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

// Adds handlers for a player with given controller
function addHandlers(controller, thisPlayer){
  controller.addActionListener(UserAction.RIGHT, thisPlayer.rightHandler);
  controller.addActionListener(UserAction.LEFT, thisPlayer.leftHandler);
  controller.addActionListener(UserAction.JUMP, thisPlayer.jumpHandler);
  controller.addActionListener(UserAction.ATTACK, thisPlayer.attackHandler);
  controller.addActionListener(UserAction.DEFENSE, () => {
    console.log("DEFENSE");
  });
}

function appStart() {
  // Set background
  const background = PIXI.Texture.fromImage("animation/background.webp");
  app.stage.addChild(new PIXI.Sprite(background));

  if(debug){
    var controller = new Controller();
    const newPlayer = new Player(controller, app, player1Animations, players.length > 0 ? 462 : 50);
    addHandlers(controller, newPlayer);
    players.push(newPlayer);
    app.ticker.add(delta => mainLoop(delta));
  }

  addControllerObserver(async (controller) => {
    const newPlayer = new Player(controller, app, player1Animations, players.length > 0 ? 462 : 50);
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
  outerBar.drawRect((100 - playerTwoHealth) * 2, 0, 200 - (100 - playerTwoHealth) * 2, 12);
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
      player.collisionPartner = otherPlayer;

      if (player.isCollision) {
        player.collisionSide = futureXPlayer < otherPlayer.posX ? "right" : "left";
      }
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
    if(player.jumping && player.speedY < player.jumpheight - 1)
      player.speedY += 1;
    else if(player.jumping && player.speedY == player.jumpheight - 1) {
      player.jumping = false;
      player.speedY = 0;
    }

    player.reduceVelocity(Math.abs(player.velocityX / 5));
    // dif (player.velocityX === 0) {
    // player.freezeOrientation = false;
    // }

    player.moveX(player.speedX);
    player.moveY(player.speedY);
  });

  drawLeftHealthBar();
  drawRightHealthBar();
}
