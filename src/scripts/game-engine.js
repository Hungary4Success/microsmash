/* eslint import/prefer-default-export: 0 */

export class GameObject {
  constructor(stage) {
    this.stage = stage;
    this.animations = {};
  }

  playAnimation(name, loop) {
    const animation = this.animations[name];
    animation.animationSpeed = 0.167;
    animation.loop = false;
    animation.visible = true;

    if (!loop) {
      animation.onComplete = function () {
        animation.visible = false;
        animation.gotoAndStop(0);
      };
    }

    animation.play();
    this.stage.addChild(animation);
  }

  isVisible(name, value) {
    this.animations[name].visible = value;
  }

  setPosition(name, posX, posY) {
    this.animations[name].position.x = posX;
    this.animations[name].position.y = posY;
  }

  setScale(name, value) {
    this.animations[name].scale.x = this.animations[name].scale.y = value;
  }

  addAnimation(name, success) {
    PIXI.loader.add(name).load(() => {
      this.animations[name] = new PIXI.extras.AnimatedSprite(
        Object.values(PIXI.loader.resources[name].spritesheet.animations)[0]
      );
      this.animations[name].pivot.x = this.animations[name].pivot.y = 0.5;

      success();
    });
  }
}
