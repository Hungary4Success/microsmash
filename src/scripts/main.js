import "./external/pixi.min.js";
import { GameObject } from "./game-engine.js";


const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

window.aThing = new GameObject(app.stage, "animation/spritesheet.json", ((thingy) => {
  thingy.setPosition(0, 0);
  thingy.setScale(0.2);
  thingy.display();
}));
