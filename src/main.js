'use strict';

class GameObject {
	constructor(sprites, xPos, yPos, loaded){
		let instance = this;
		PIXI.loader.add(sprites).load(function() {
			instance.sprites = PIXI.loader.resources[sprites];
		});
		instance.pos = new Position(xPos, yPos);

		if (typeof loaded === "function") {
			loaded();
		}
		else {
			console.error("GameObject: loaded should be a function!");
		}
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

//let aThing = new GameObject("", 0, 0);
