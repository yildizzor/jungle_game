window.onload = () => {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

  let game;

  startButton.addEventListener("click", () => {
    console.log("GAME STARTED");

    game = new Game();
    game.start();
  });

  restartButton.addEventListener("click", function () {
    location.reload();
  });

  window.addEventListener("keydown", (event) => {
    const keyPressed = event.key;

    switch (keyPressed) {
      case "ArrowUp":
      case " ":
        event.preventDefault();
        game.rider.setJumping(true);
        break;
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target.id === "game-screen") {
      game.rider.setJumping(true);
    }
  });
};
