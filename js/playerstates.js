const states = {
  RUNNING: 0,
  JUMPING: 1,
  FALLING: 2,
  HIT: 3,
  BENDING: 4,
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
    this.audio;
    this.stateStartTime = 0;
    this.stateElapsedTime = 0;
  }

  cleanUp() {
    // Override this if any state needs to cleanup
  }

  isGamePaused() {
    return false;
  }

  play() {
    if (this.audio) {
      this.audio.play();
    }
  }

  elapsedTimePassed(duration) {
    if (this.stateStartTime === 0) {
      this.stateStartTime = this.game.currentTime;
    } else {
      this.stateElapsedTime = this.game.currentTime - this.stateStartTime;

      if (this.stateElapsedTime > duration) {
        this.stateStartTime = 0;
        return true;
      }
    }

    return false;
  }
}

class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 16;
  }

  handleInput(input) {
    if (input.isJumping()) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.isBending()) {
      this.game.player.setState(states.BENDING, 1);
    }
  }
}

class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
    this.audio = document.getElementById("jumping-sound");
  }

  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= 27;
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 0;
    this.play();
  }

  handleInput(input) {
    if (this.game.player.vy > this.game.gravity) {
      this.game.player.setState(states.FALLING, 1);
    }
  }
}

class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 0;
  }

  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}

class Bending extends State {
  constructor(game) {
    super("BENDING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 16;

    // Lower position for bending effect
    this.game.player.yOffset = 50;

    const image = this.game.player.image;
    this.game.player.image = this.game.player.tempImage;
    this.game.player.tempImage = image;
  }

  cleanUp() {
    // Reset offset when Bending state is completed
    this.game.player.yOffset = 0;

    const image = this.game.player.image;
    this.game.player.image = this.game.player.tempImage;
    this.game.player.tempImage = image;
  }

  handleInput(input) {
    if (!input.isBending()) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}

class Hitting extends State {
  constructor(game) {
    super("HITTING", game);
  }

  enter() {
    this.game.player.vy = 0;
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 0;
  }

  isGamePaused() {
    return true;
  }

  handleInput(input) {
    if (this.elapsedTimePassed(2000)) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}
