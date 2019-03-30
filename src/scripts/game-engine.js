export class GameObject {
    constructor(stage, sprites, loaded){
        let instance = this;

        instance.stage = stage;

        PIXI.Loader.shared.add(sprites).load(function() {
            instance.sprites = new PIXI.AnimatedSprite(
                PIXI.Loader.shared.resources[sprites].spritesheet.animations["dead"]);

            instance.sprites.pivot.x = instance.sprites.pivot.y = 0.5;
            
            if (typeof loaded === "function") {
                loaded(instance);
            }
            else {
                console.error("GameObject: loaded should be a function!");
            }
        });

    }

    display() {
        this.sprites.animationSpeed = 0.167;
        this.sprites.play();
        this.stage.addChild(this.sprites);
    }

    isVisible(value) {
        this.sprites.visible = value;
    }

    setPosition(posX, posY) {
        this.sprites.position.x = posX;
        this.sprites.position.y = posY;
    }

    setScale(value) {
        this.sprites.scale.x = this.sprites.scale.y = value;
    }
}