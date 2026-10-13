// Confetti Library Function
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

// Step 2: Show Stylized Alert Popup on Click
function showAlertMessage() {
  const existingAlert = document.querySelector(".tuff-alert");
  if (existingAlert) existingAlert.remove();

  const popup = document.createElement("div");
  popup.className = "tuff-alert";
  popup.innerHTML = `
    <h3 style="color: #38bdf8; margin-top:0;">⚠️ SYSTEM NOTICE</h3>
    <p>Step 2: External JavaScript Click Event Active!</p>
    <button class="confetti-btn" id="alert-close" style="padding: 8px 18px; font-size: 14px;">Acknowledge</button>
  `;

  document.body.appendChild(popup);

  document.getElementById("alert-close").addEventListener("click", () => {
    popup.classList.add("fade-out");
    setTimeout(() => popup.remove(), 400);
  });
}

// Step 3, 4, & 5: Input Handling with If/Else Logic Decision Making
function updateUserText() {
  const inputField = document.getElementById("user-input");
  const displayElement = document.getElementById("display-text");
  const userText = inputField.value.trim().toLowerCase();

  let decisionResult = "";

  // Step 5: If / Else Logic Conditions
  if (userText === "") {
    decisionResult = "⚠️ Please type something in the box first!";
  } else if (userText === "baseball") {
    decisionResult = "⚾ Play ball! Baseball is one of your favorite sports!";
    fireConfetti();
  } else if (userText === "golf") {
    decisionResult = "⛳ Hole in one! Golf is great for fun!";
    fireConfetti();
  } else {
    decisionResult = "You entered: \"" + inputField.value.trim() + "\" - Cool custom input!";
  }

  // Step 3: Change something on the page (Text update)
  displayElement.innerText = decisionResult;
  inputField.value = ""; // Clear input
}

// Step 6: Magic 8-Ball Answer Generator
function askEightBall() {
  const answers = [
    "🎱 It is certain!",
    "🎱 Without a doubt!",
    "🎱 Reply hazy, try again later.",
    "🎱 Ask again later...",
    "🎱 Don't count on it.",
    "🎱 My sources say no.",
    "🎱 Outlook looks good!"
  ];

  const randomIndex = Math.floor(Math.random() * answers.length);
  const resultElement = document.getElementById("eight-ball-result");
  
  resultElement.innerText = answers[randomIndex];
}

// =========================================
// FLAPPY BIRD ARCADE GAME LOGIC
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
  
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  birdVelocity += birdGravity;
  birdY += birdVelocity;

  ctx.save();
  ctx.shadowColor = "#facc15";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(80, birdY, 12, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(84, birdY - 3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(90, birdY - 2);
  ctx.lineTo(98, birdY + 2);
  ctx.lineTo(90, birdY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

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

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= 2.5;

    ctx.save();
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;
    ctx.fillRect(pipes[i].x, 0, 48, pipes[i].top);
    ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, 48, pipes[i].bottom);
    ctx.restore();

    if (!pipes[i].passed && pipes[i].x + 48 < 80) {
      pipes[i].passed = true;
      score++;
      document.getElementById("game-score").innerText = score;
      
      if (score > highScore) {
        highScore = score;
        document.getElementById("game-highscore").innerText = highScore;
      }
    }

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

    if (pipes[i].x + 48 < 0) {
      pipes.splice(i, 1);
    }
  }

  if (birdY + 12 >= canvas.height || birdY - 12 <= 0) {
    endGame();
    return;
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animationFrameId);

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

// Attach Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("theme-btn").addEventListener("click", toggleDarkMode);
  document.getElementById("confetti-btn").addEventListener("click", fireConfetti);
  document.getElementById("start-btn").addEventListener("click", initFlappyGame);
  
  // Assignment Steps Handlers
  document.getElementById("alert-btn").addEventListener("click", showAlertMessage);
  document.getElementById("submit-btn").addEventListener("click", updateUserText);
  document.getElementById("eight-ball-btn").addEventListener("click", askEightBall);

  document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      updateUserText();
    }
  });

  const canvasElement = document.getElementById("flappy-canvas");
  canvasElement.addEventListener("click", handleFlappyJump);

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      handleFlappyJump();
    }
  });

  drawStartScreen();
});
