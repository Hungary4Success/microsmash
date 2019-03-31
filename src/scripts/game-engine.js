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
    this.posY += value;
    this.currentAnimation.y = this.posY;
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

  getHeight() {
    return this.currentAnimation.height;
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
        case "dead": instance.deadAnim = animation; break;
        case "jump": instance.jumpAnim = animation; break;
        case "attack": instance.attackAnim = animation; break;
        case "dead": instance.dieAnim = animation; break;
        default: break;
      }
    }
    
    instance.currentAnimation = instance.animations[instance.idleAnim];
    instance.setScale(0.5);
    instance.setPosition(instance.getWidth() / 2, 512);

    instance.health = 100;
    instance.velocityX = 0;
    instance.velocityY = 0;
    instance.speedX = 0;
    instance.speedY = 0;
    instance.posX = startPosX;
    instance.dimensions = instance.currentAnimation.width;
    instance.jumpheight = 20;
    instance.jumping = false;
    // If player is defending, the other player won't be able to deal damage
    instance.defending = false;

    if (startPosX > app.view.width / 2) {
      instance.currentAnimation.scale.x *= -1;
    }

    instance.rightHandler = instance.rightHandler.bind(this);
    instance.leftHandler = instance.leftHandler.bind(this);
    instance.jumpHandler = instance.jumpHandler.bind(this);
    instance.attackHandler = instance.attackHandler.bind(this);
    instance.defendHandler = instance.defendHandler.bind(this);

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

    if (this._blovkMovement) {
      return;
    }
    super.moveX(value);

    if (this.currentAnimation._blockAnims) {
      return;
    }
    this.playAnimation(this.runAnim, true);
  }

  rightHandler(bigness) {
    if (!bigness) {
      this.speedX = 5;
    }
    else if (bigness < 400) {
      this.speedX = 0;
    }
    else {
      this.speedX = bigness / 150;
    }

    this.freezeOrientation = false;
  }

  leftHandler(bigness) {
    if (!bigness) {
      this.speedX = -5;
    }
    else if (bigness > -400) {
      this.speedX = 0;
    }
    else {
      this.speedX = bigness / 150;
    }
    this.freezeOrientation = false;
  }

  jumpHandler(bigness) {
    if(!this.jumping) {
      this.jumping = true;
      // TODO add animation (doesn't work now)
      this.playAnimation(this.jumpAnim, false);
      this.speedY = -this.jumpheight;
      this.freezeOrientation = false;
    }
  }

  die() {
    console.log("DIE");
    const instance = this;
    this.playAnimation(this.deadAnim, false, function() {
      instance.animations[instance.idleAnim].destroy();
      let text = new PIXI.Text("You Won",{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
      instance.app.stage.addChild(text);
      instance.app.stop();
    })
  }

  attackHandler() {
    if (this._blockAttack) return;
    console.log("Attack");

    this._blockAttack = true;

    if (!this.jumping) {
      this._blovkMovement = true;
    }

    // Play the animation
    const instance = this;
    if (!instance.jumping) {
      instance.velocityX = 0;
      instance.speedX = 0;
    }
    instance.currentAnimation._blockAnims = false;
    instance.playAnimation(instance.attackAnim, false, () => {
      this._blockAttack = false;
      this._blovkMovement = false;
      instance.playAnimation(instance.idleAnim, true);
    });

    // Deduct health if can hit
    const isLeftFacing = this.currentAnimation.scale.x < 0;
    if (isLeftFacing) {
      if (this.leftHitTarget) {
        this.leftHitTarget.health -= 10;
        if (this.leftHitTarget.health === 0) {
          this.leftHitTarget.die();
        }
      }
    }
    else if (this.rightHitTarget) {
      this.rightHitTarget.health -= 10;
      if (this.rightHitTarget.health === 0) {
          this.rightHitTarget.die();
        }
    }
  }

  defendHandler() {
    return;
    console.log("Defend");

    // Play the animation
    const instance = this;
    instance.velocityX = 0;
    instance.speedX = 0;
    instance.defending = true;
    // Todo change animation from dead to defend
    instance.playAnimation(instance.deadAnim, false, () => {
      instance.defending = false;
      instance.playAnimation(instance.idleAnim, true);
    });
  }
}
