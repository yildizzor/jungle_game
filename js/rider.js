class Rider extends Component {
  constructor(gameScreen, bottom, width, height, left, gravity) {
    super(gameScreen, bottom, width, height, left);
    this.createDivElement("rider", "./images/fietser.png");

    // set riding animation for background image
    this.animationDuration = 0.9; // in seconds
    this.element.style.animation = `ride ${this.animationDuration}s steps(17) infinite`;

    // gravity related properties
    this.groundLevel = bottom;
    this.jumping = false;
    this.maxTopPosition = bottom + 350;
    this.velocity = 0;
    this.gravity = gravity;
  }

  move() {
    if (!this.isJumping()) {
      this.velocity = 0;
      return;
    }

    if (this.onGround()) {
      this.velocity -= 10;
    }

    this.bottom -= this.velocity;

    if (this.onGround()) {
      this.resetAnimationDuration(); // restart riding animation
      this.setJumping(false); // set jumping false
      this.bottom = this.groundLevel; // make rider on the ground level
      this.velocity = 0; // velocity will be initial value again
    } else {
      this.setAnimationDuration(0); // stop riding animation because rider jumped
      this.velocity += this.gravity; // gravity effect
    }

    // If we reach to determined max top position, rider should not go up anymore
    if (this.bottom >= this.maxTopPosition) {
      this.bottom = this.maxTopPosition;
    }

    // After changing bottom values of rider div element,
    // set the new position to make real movement on screen.
    this.updatePosition();
  }

  onGround() {
    return this.bottom <= this.groundLevel;
  }

  setAnimationDuration(animationDuration) {
    this.element.style.animationDuration = `${animationDuration}s`;
  }

  resetAnimationDuration() {
    this.setAnimationDuration(this.animationDuration);
  }

  updatePosition() {
    this.element.style.bottom = `${this.bottom}px`;
  }

  resetPosition() {
    this.bottom = this.groundLevel;
    this.element.style.bottom = `${this.bottom}px`;
  }

  didCollide(obstacle) {
    const rider = this.element.getBoundingClientRect();
    const obs = obstacle.element.getBoundingClientRect();

    if (
      rider.right - 40 > obs.left &&
      rider.left < obs.right - 55 &&
      rider.bottom > obs.top
    ) {
      return true;
    } else {
      return false;
    }
  }

  isJumping() {
    return this.jumping;
  }

  setJumping(jumping) {
    this.jumping = jumping;
  }
}
