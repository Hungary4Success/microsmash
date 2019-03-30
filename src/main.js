'use strict';

class GameObject {
    constructor(sprites, xPos, yPos, loaded){
        let instance = this;
        instance.pos = new Position(xPos, yPos);
        PIXI.Loader.shared.add(sprites).load(function() {
            instance.sprites = PIXI.Loader.shared.resources[sprites];
            if (typeof loaded === "function") {
                loaded(instance);
            }
            else {
                console.error("GameObject: loaded should be a function!");
            }
        });

    }

    display(stage) {
        stage.addChild(new PIXI.Sprite(this.sprites.texture));
    }
}

class Position {
    constructor(xPos, yPos) {
        this.x = xPos;
        this.y = yPos;
    }
}

const app = new PIXI.Application({
    width: 512,
    height: 512,
    antialias: true
});

document.querySelector("#GameView").appendChild(app.view);

let aThing = new GameObject("attack _01.png", 0, 0, function(thingy) {
    thingy.display(app.stage);
});
