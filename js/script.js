window.addEventListener("load", function () {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

  const canvas = document.getElementById("game-canvas");
  const context = canvas.getContext("2d");
  canvas.width = 1440;
  canvas.height = 800;

  const game = new Game(canvas.width, canvas.height);

  let lastTimeStamp = 0;

  // timestamp parameter passed by requestAnimationFrame function behind the scene
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    // clears the entire previous canvas drawing before starting new drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update all the drawings positions,
    // So, then we can draw all the images according to new positions
    game.update(deltaTime);
    game.draw(context);

    // Check if game is over
    if (game.gameOver === true) {
      game.end();
    } else {
      requestAnimationFrame(animate); // => This is a special function in JS to update the animation onscreen.
    }
  }

  // When click event happens on Start Button, game will start
  startButton.addEventListener("click", () => {
    game.start(context);
    animate(0);
  });

  // When click event happens on Restart Button, window is reloaded to start for a new game
  restartButton.addEventListener("click", () => {
    location.reload(); // => This is a special JS function like as window or document...
  });
});
