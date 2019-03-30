/* eslint import/prefer-default-export: 0 */

export class GameObject {
  constructor(stage) {
    this.stage = stage;
    this.animations = {};
  }

  playAnimation(name, loop, success) {
    const animation = this.animations[name];
    this.currentAnimation = animation;
    animation.animationSpeed = 0.167;
    animation.loop = loop;
    animation.visible = true;

    if (!loop) {
      animation.onComplete = () => {
        animation.visible = false;
        animation.gotoAndStop(0);

        if (typeof success === "function") {
          success(animation);
        }
      };
    }

    animation.play();
    this.stage.addChild(animation);
  }

  isVisible(name, value) {
    this.animations[name].visible = value;
  }

  setPosition(posX, posY) {
    for (var key in this.animations) {
      this.animations[key].x = posX;
      this.animations[key].y = posY;
      this.animations[key].play();
    }
  }

  moveX(value) {
    let isLeftFacing = this.currentAnimation.scale.x < 0;
    let isGonnaFaceLeft = value < 0;
    if ((isLeftFacing && !isGonnaFaceLeft) || (!isLeftFacing && isGonnaFaceLeft)) {
      this.currentAnimation.scale.x *= -1;
      console.log("Flip");
    }
    this.currentAnimation.x += value;
  }

  moveY(value) {
    this.currentAnimation.y = value;
  }

  getPosX() {
    return this.currentAnimation.x;
  }

  getPosY() {
    return this.currentAnimation.y;
  }  

  setScale(name, value) {
    this.animations[name].scale.x = this.animations[name].scale.y = value;
  }

  getWidth() {
    return this.currentAnimation.width;
  }

  addAnimation(name) {
    if (PIXI.loader.resources[name]) {
      this.animations[name] = new PIXI.extras.AnimatedSprite(
        Object.values(PIXI.loader.resources[name].spritesheet.animations)[0]
      );
      this.animations[name].anchor.y = 1;
      this.animations[name].anchor.x = 0.5;
      this.currentAnimation = this.animations[name];
    }
    else {
      console.error("GameObject: Cannot add animation that was not preloaded.");
    }
  }

  Update() {
    this.currentAnimation.x += 1;
  }
}
