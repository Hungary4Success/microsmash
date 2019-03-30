import "./external/pixi.min.js";
import { GameObject } from "./game-engine.js";


const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

window.deadAnimation = "animation/spritesheet.json";
window.aThing = new GameObject(app.stage);
aThing.addAnimation(deadAnimation, () => {
  aThing.setPosition(deadAnimation ,0, 0);
  aThing.setScale(deadAnimation, 0.2);
});

document.body.addEventListener("click", function () {
  console.log("Click");
  window.aThing.playAnimation(deadAnimation, false, function(animation) {
    console.log("End");
    animation.visible = false;
  });
});
