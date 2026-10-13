// Confetti Function
function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Dark/Light Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
}

// =========================================
// Flappy Bird Arcade Game Logic
// =========================================
let canvas, ctx;
let birdY, birdVelocity, birdGravity, birdJump;
let pipes = [];
let frameCount = 0;
let score = 0;
let highScore = 0;
let gameRunning = false;
let animationFrameId;

function initFlappyGame() {
  canvas = document.getElementById("flappy-canvas");
  ctx = canvas.getContext("2d");

  // Reset Bird State
  birdY = canvas.height / 2;
  birdVelocity = 0;
  birdGravity = 0.45;
  birdJump = -7.5;
  
  pipes = [];
  frameCount = 0;
  score = 0;
  
  document.getElementById("game-score").innerText = score;
  
  if (!gameRunning) {
    gameRunning = true;
    gameLoop();
  }
}

function handleFlappyJump() {
  if (!gameRunning) {
    initFlappyGame();
    return;
  }
  birdVelocity = birdJump;
}

function gameLoop() {
  if (!gameRunning) return;

  frameCount++;
  
  // Clear Frame
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply Gravity to Bird
  birdVelocity += birdGravity;
  birdY += birdVelocity;

  // Draw Bird (Yellow Glowing Circle with Beak)
  ctx.save();
  ctx.shadowColor = "#facc15";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(80, birdY, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw Eye
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(84, birdY - 3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw Beak
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(90, birdY - 2);
  ctx.lineTo(98, birdY + 2);
  ctx.lineTo(90, birdY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Spawn Glowing Electric Blue Pipes
  if (frameCount % 90 === 0) {
    const gapHeight = 110;
    const minHeight = 40;
    const maxHeight = canvas.height - gapHeight - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: canvas.height - topHeight - gapHeight,
      passed: false
    });
  }

  // Move & Draw Pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= 2.5;

    // Draw Top Pipe
    ctx.save();
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;
    ctx.fillRect(pipes[i].x, 0, 48, pipes[i].top);

    // Draw Bottom Pipe
    ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, 48, pipes[i].bottom);
    ctx.restore();

    // Check Score
    if (!pipes[i].passed && pipes[i].x + 48 < 80) {
      pipes[i].passed = true;
      score++;
      document.getElementById("game-score").innerText = score;
      
      if (score > highScore) {
        highScore = score;
        document.getElementById("game-highscore").innerText = highScore;
      }
    }

    // Check Collisions
    const birdRadius = 12;
    const birdX = 80;

    if (
      birdX + birdRadius > pipes[i].x &&
      birdX - birdRadius < pipes[i].x + 48 &&
      (birdY - birdRadius < pipes[i].top || birdY + birdRadius > canvas.height - pipes[i].bottom)
    ) {
      endGame();
      return;
    }

    // Remove Off-Screen Pipes
    if (pipes[i].x + 48 < 0) {
      pipes.splice(i, 1);
    }
  }

  // Check Ground / Ceiling Collisions
  if (birdY + 12 >= canvas.height || birdY - 12 <= 0) {
    endGame();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animationFrameId);

  // Draw Game Over Banner
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 26px 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "18px 'Times New Roman', serif";
  ctx.fillText("Click or Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 25);

  if (score >= 5) {
    fireConfetti();
  }
}

// Draw initial start screen on canvas
function drawStartScreen() {
  canvas = document.getElementById("flappy-canvas");
  ctx = canvas.getContext("2d");

  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 22px 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.fillText("FLAPPY BIRD ARCADE", canvas.width / 2, canvas.height / 2 - 15);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "16px 'Times New Roman', serif";
  ctx.fillText("Click or Press SPACE to Jump", canvas.width / 2, canvas.height / 2 + 20);
}

// Attach Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("theme-btn").addEventListener("click", toggleDarkMode);
  document.getElementById("confetti-btn").addEventListener("click", fireConfetti);
  document.getElementById("start-btn").addEventListener("click", initFlappyGame);

  const canvasElement = document.getElementById("flappy-canvas");
  canvasElement.addEventListener("click", handleFlappyJump);

  // Keyboard Spacebar Jump Control
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault(); // Prevents page scrolling down when pressing Space
      handleFlappyJump();
    }
  });

  drawStartScreen();
});
