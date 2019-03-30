/* eslint import/prefer-default-export: 0 */

export class GameObject {
  constructor(stage) {
    this.stage = stage;
    this.animations = {};
  }

  playAnimation(name, loop, success) {
    if (this.currentAnimation) {
      this.currentAnimation.visible = false;
    }
    const animation = this.animations[name];
    this.currentAnimation = animation;
    animation.animationSpeed = 0.167;
    animation.loop = loop;
    animation.visible = true;
    animation.x = this.posX;
    animation.y = this.posY;
    if (this.scaleX) {
      animation.scale.x = this.scaleX;
    }

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
    this.posX = posX;
    this.posY = posY;
    for (var key in this.animations) {
      this.animations[key].x = posX;
      this.animations[key].y = posY;
    }
  }

  moveX(value) {
    let isLeftFacing = this.currentAnimation.scale.x < 0;
    let isGonnaFaceLeft = value < 0;
    if ((isLeftFacing && !isGonnaFaceLeft) || (!isLeftFacing && isGonnaFaceLeft)) {
      this.currentAnimation.scale.x *= -1;
      this.scaleX = this.currentAnimation.scale.x;
    }
    this.currentAnimation.x += value;
    this.posX = this.currentAnimation.x;
  }

  moveY(value) {
    this.currentAnimation.y = value;
  }

  getPosX() {
    return this.posX;
  }

  getPosY() {
    return this.posY;
  }  

  setScale(value) {
    for (var key in this.animations) {
      this.animations[key].scale.x = this.animations[key].scale.y = value;
    }
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
    }
    else {
      console.error("GameObject: Cannot add animation that was not preloaded.");
    }
  }

  Update() {
    this.currentAnimation.x += 1;
  }
}

export class Player extends GameObject {
  constructor(stage, animations) {
    super(stage);

    const instance = this;
    let animationKeys = Object.keys(animations);
    for (var i = 0; i < animationKeys.length; i++) {
      let animation = animations[animationKeys[i]];
      instance.addAnimation(animation);

      switch(animationKeys[i]) {
        case "idle":   instance.idleAnim = animation; break;
        case "walk":   instance.walkAnim = animation; break;
        case "attack": instance.attackAnim = animation; break;
      }
    }

    instance.currentAnimation = instance.animations[instance.idleAnim];
    instance.setScale(0.5);
    instance.setPosition(instance.getWidth() / 2, 512);

    instance.state = {
      health: 100,
      velocityX: 0
    }

    instance.playAnimation(instance.idleAnim, true);
  }

  rightHandler = (bignessxD, animation) => {
    console.log("RIGHT");
    this.moveX(10);
  };

  leftHandler = (bignessxD, animation) => {
    this.moveX(-10);
  };

  attackHandler = (animation) => {
    this.playAnimation(animation, false, function() {

    });
  }
}
