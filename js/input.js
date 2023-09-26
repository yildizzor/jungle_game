class InputHandler {
  constructor(game) {
    this.game = game;
    this.jumpingAudio = document.getElementById("jumping-sound");
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
        if (
          e.key === "ArrowUp" &&
          this.game.player.onGround() &&
          !this.game.player.isBendingState()
        ) {
          debugger;
          this.jumpingAudio.play();
        }
      } else if (e.key === "d") this.game.debug = !this.game.debug;
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
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

  play() {
    if (this.isJumping() && this.game.player.onGround()) {
      this.jumpingAudio.play();
    }
  }
}
