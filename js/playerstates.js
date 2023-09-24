const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3, 
  HIT: 4, 
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game; 
  }
}

class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
   
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 16;
    this.game.player.frameY = 0;
  }

  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}

class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 16;
    this.game.player.frameY = 0;
  }

  handleInput(input) {
    if (input.includes("ArrowLeft")) {
      this.game.player.setState(states.SITTING, 0);
    } else if (input.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING, 1);
    }
  }
}

class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
    this.game.player = player;
  }

  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= 27;
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 0;
    this.game.player.frameY = 0;
  }

  handleInput(input) {
    if (this.game.player.vy > this.game.player.weight) {
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
    this.game.player.maxFrame = 16;
    this.game.player.frameY = 0;
  }

  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}


class Hitting extends State {
  constructor(game) {
    super("HITTING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 16;
    this.game.player.frameY = 0;
  }

  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}