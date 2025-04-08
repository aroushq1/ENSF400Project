/**
 * @file game.js
 * @description Core logic for Pong game with simple AI opponent.
 */

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

let isPaused = false;
let scores = [0, 0];

/**
 * Represents the ball object in the game.
 * @type {Object}
 */
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};

/**
 * Represents the user's paddle.
 * @type {Object}
 */
const userPaddle = {
    x: 10,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 4
};

/**
 * Represents the AI's paddle.
 * @type {Object}
 */
const aiPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 4
};

/**
 * Moves the paddle to a new vertical position.
 * @param {Object} paddle - The paddle to move.
 * @param {number} y - The new y-coordinate.
 */
function movePaddle(paddle, y) {
    paddle.y = y;

    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

/**
 * Updates the ball's position and handles collisions.
 */
function moveBall() {
    if (isPaused) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy *= -1;
    }

    // User paddle collision
    if (
        ball.x - ball.radius <= userPaddle.x + userPaddle.width &&
        ball.x + ball.radius >= userPaddle.x &&
        ball.y + ball.radius >= userPaddle.y &&
        ball.y - ball.radius <= userPaddle.y + userPaddle.height
    ) {
        ball.dx *= -1;
        ball.speed++;
        let collidePoint = ball.y - (userPaddle.y + userPaddle.height / 2);
        collidePoint /= (userPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.dy = ball.speed * Math.sin(angleRad);
        adjustAiTarget();
    }

    // AI paddle collision
    if (
        ball.x + ball.radius > aiPaddle.x &&
        ball.x - ball.radius < aiPaddle.x + aiPaddle.width &&
        ball.y + ball.radius > aiPaddle.y &&
        ball.y - ball.radius < aiPaddle.y + aiPaddle.height
    ) {
        ball.dx *= -1;
        ball.speed++;
        let collidePoint = ball.y - (aiPaddle.y + aiPaddle.height / 2);
        collidePoint /= (aiPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.dy = ball.speed * Math.sin(angleRad);
        adjustAiTarget();
    }

    // Scoring
    if (ball.x + ball.radius > canvas.width) {
        scores[0]++;
        resetBall(-1);
    }

    if (ball.x + ball.radius < 0) {
        scores[1]++;
        resetBall(1);
    }
}

/**
 * Resets the ball to the center and gives it a new direction.
 * @param {number} direction - The horizontal direction to launch the ball (1 or -1).
 */
function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 4;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dx = direction * ball.speed;
}

let aiTargetY = canvas.height / 2;

/**
 * Adjusts the AI's target position based on the ball's Y.
 */
function adjustAiTarget() {
    aiTargetY = ball.y + (Math.random() * 60 - 30);
}

/**
 * AI logic to move toward the ball when active.
 */
function aiLogic() {
    if (isPaused) return;

    if (ball.dx > 0) {
        adjustAiTarget();
    }

    if (aiPaddle.y + aiPaddle.height / 2 < aiTargetY) {
        movePaddle(aiPaddle, aiPaddle.y + aiPaddle.dy);
    } else {
        movePaddle(aiPaddle, aiPaddle.y - aiPaddle.dy);
    }
}

/**
 * Updates the game state.
 */
function update() {
    aiLogic();
    draw();
    requestAnimationFrame(update);
}

/**
 * Renders the game frame.
 */
function draw() {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.fillRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillText(scores[0], canvas.width / 4, 30);
    ctx.fillText(scores[1], (3 * canvas.width) / 4, 30);

    moveBall();
}

/**
 * Toggles the game pause state.
 */
function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
}

// User paddle control
canvas.addEventListener("mousemove", (e) => {
    if (isPaused) return;
    let rect = canvas.getBoundingClientRect();
    let y = e.clientY - rect.top;
    movePaddle(userPaddle, y - userPaddle.height / 2);
});

// Pause button control
document.getElementById('pauseButton').addEventListener("click", togglePause);

// Start the game
update();
