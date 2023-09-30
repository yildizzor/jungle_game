class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.controlKeys = ["ArrowDown", "ArrowUp"];

    window.addEventListener("keydown", (e) => {
      if (this.controlKeys.includes(e.key) && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      } else if (e.key === "d") this.game.debug = !this.game.debug;
    });

    window.addEventListener("keyup", (e) => {
      if (this.controlKeys.includes(e.key)) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }

  isJumping() {
    return this.keys.includes("ArrowUp");
  }

  isBending() {
    return this.keys.includes("ArrowDown");
  }
}
