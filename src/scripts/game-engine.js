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

    const animationNames = Object.keys(this.animations);
    for (let i = 0; i < animationNames.length; i++) {
      const currentAnimation = this.animations[animationNames[i]];

      currentAnimation.x = posX;
      currentAnimation.y = posY;
    }
  }

  moveX(value) {
    const isLeftFacing = this.currentAnimation.scale.x < 0;
    const isGonnaFaceLeft = value < 0;
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

  Update() {
    this.currentAnimation.x += 1;
  }
}

export class Player extends GameObject {
  constructor(stage, animations) {
    super(stage);

    const instance = this;
    const animationKeys = Object.keys(animations);
    for (let i = 0; i < animationKeys.length; i++) {
      const animation = animations[animationKeys[i]];
      instance.addAnimation(animation);

      switch (animationKeys[i]) {
        case "idle": instance.idleAnim = animation; break;
        case "walk": instance.walkAnim = animation; break;
        case "attack": instance.attackAnim = animation; break;
        default: break;
      }
    }

    instance.currentAnimation = instance.animations[instance.idleAnim];
    instance.setScale(0.5);
    instance.setPosition(instance.getWidth() / 2, 512);

    instance.state = {
      health: 100,
      velocityX: 0
    };

    instance.playAnimation(instance.idleAnim, true);

    this.rightHandler = this.rightHandler.bind(this);
    this.leftHandler = this.leftHandler.bind(this);
    this.attackHandler = this.attackHandler.bind(this);
  }

  rightHandler() {
    console.log("RIGHT");
    this.moveX(10);
  }

  leftHandler() {
    this.moveX(-10);
  }

  attackHandler(animation) {
    this.playAnimation(animation, false, () => {

    });
  }
}
