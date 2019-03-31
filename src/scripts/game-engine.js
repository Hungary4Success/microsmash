/* eslint import/prefer-default-export: 0 */

export class GameObject {
  constructor(app) {
    this.app = app;

    this.animations = {};
  }

  playAnimation(name, loop, success) {
    if (this.currentAnimation && this.currentAnimation._blockAnims) {
      return;
    }
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
      animation._blockAnims = true;
      animation.onComplete = () => {
        animation.visible = false;
        animation.gotoAndStop(0);
        animation._blockAnims = false;

        if (typeof success === "function") {
          success(animation);
        }
      };
    }

    animation.play();
    this.app.stage.addChild(animation);
  }

  isVisible(name, value) {
    this.animations[name].visible = value;
  }

  setPosition(posX, posY) {
    this.posX = posX;
    this.posY = posY;

    const animationNames = Object.keys(this.animations);
    for (let i = 0; i < animationNames.length; i++) {
      const currentAnimation = this.animations[animationNames[i]];

      currentAnimation.x = posX;
      currentAnimation.y = posY;
    }
  }

  moveX(value) {
    if (!this.freezeOrientation) {
      const isLeftFacing = this.currentAnimation.scale.x < 0;
      const isGonnaFaceLeft = value < 0;
      if ((isLeftFacing && !isGonnaFaceLeft) || (!isLeftFacing && isGonnaFaceLeft)) {
        this.currentAnimation.scale.x *= -1;
        this.scaleX = this.currentAnimation.scale.x;
      }
    }
    this.posX += value;

    // Boundary checks
    if (this.posX < -(this.getWidth() / 2)) {
      this.posX = this.app.view.width + this.getWidth() / 2;
    } else if (this.posX > this.app.view.width + (this.getWidth() / 2)) {
      this.posX = -(this.getWidth() / 2);
    }

    this.currentAnimation.x = this.posX;
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
    const animationNames = Object.keys(this.animations);
    for (let i = 0; i < animationNames.length; i++) {
      const currentAnimation = this.animations[animationNames[i]];

      currentAnimation.scale.x = value;
      currentAnimation.scale.y = value;
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
    } else {
      console.error("GameObject: Cannot add animation that was not preloaded.");
    }
  }
}

export class Player extends GameObject {
  constructor(controller, app, animations, startPosX) {
    super(app);

    const instance = this;
    instance.controller = controller;

    const animationKeys = Object.keys(animations);
    for (let i = 0; i < animationKeys.length; i++) {
      const animation = animations[animationKeys[i]];
      instance.addAnimation(animation);

      switch (animationKeys[i]) {
        case "idle": instance.idleAnim = animation; break;
        case "run": instance.runAnim = animation; break;
        case "attack": instance.attackAnim = animation; break;
        default: break;
      }
    }

    instance.currentAnimation = instance.animations[instance.idleAnim];
    instance.setScale(0.5);
    instance.setPosition(instance.getWidth() / 2, 512);

    instance.health = 100;
    instance.velocityX = 0;
    instance.speedX = 0;
    instance.posX = startPosX;
    instance.dimensions = instance.currentAnimation.width;

    if (startPosX > app.view.width / 2) {
      instance.currentAnimation.scale.x *= -1;
    }

    instance.rightHandler = instance.rightHandler.bind(this);
    instance.leftHandler = instance.leftHandler.bind(this);
    instance.attackHandler = instance.attackHandler.bind(this);

    instance.playAnimation(instance.idleAnim, true);
  }


  reduceVelocity(value) {
    if (this.velocityX > value) {
      this.velocityX -= value;
    } else if (this.velocityX < value) {
      this.velocityX += value;
    }
  }

  moveX(value) {
    if (Math.abs(value) < 0.1) {
      this.playAnimation(this.idleAnim, true);
      return;
    }

    if (this.currentAnimation._blockAnims) {
      return;
    }

    super.moveX(value);
    this.playAnimation(this.runAnim, true);
  }

  rightHandler() {
    this.speedX = 5;
    this.freezeOrientation = false;
  }

  leftHandler() {
    this.speedX = -5;
    this.freezeOrientation = false;
  }

  attackHandler() {
    console.log("Attack");

    // Play the animation
    const instance = this;
    instance.velocityX = 0;
    instance.speedX = 0;
    instance.playAnimation(instance.attackAnim, false, () => {
      instance.playAnimation(instance.idleAnim, true);
    });
  }
}
