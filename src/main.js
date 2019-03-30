'use strict';

import * as PIXI from 'pixi.js';

export class GameObject {
    constructor(sprites, xPos, yPos, loaded){
        let instance = this;
        instance.pos = new PIXI.Point(xPos, yPos);
        PIXI.Loader.shared.add(sprites).load(function() {
            instance.sprites = new PIXI.AnimatedSprite(
                PIXI.Loader.shared.resources[sprites].spritesheet.animations["dead"]);

            instance.sprites.pivot.x = instance.sprites.pivot.y = 0.5;
            instance.sprites.scale.x = instance.sprites.scale.y = 0.2;
            instance.sprites.position = instance.pos;

            if (typeof loaded === "function") {
                loaded(instance);
            }
            else {
                console.error("GameObject: loaded should be a function!");
            }
        });

    }

    display(stage) {
        this.sprites.animationSpeed = 0.167;
        this.sprites.play();
        stage.addChild(this.sprites);
    }
}

const app = new PIXI.Application({
    width: 512,
    height: 512,
    antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

let aThing = new GameObject("animation/spritesheet.json", 0, 0, function(thingy) {
    thingy.display(app.stage);
});
