const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

let isPaused = false;
let scores = [0,0]

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 4,
    dx : 4,
    dy : 4
}

const userPaddle = {
    x: 10,
    y : canvas.height/2 -40,
    width: 10,
    height: 80,
    dy: 4
}

const aiPaddle = {
    x: canvas.width - 20,
    y: canvas.height/2 - 40,
    width: 10,
    height: 80,
    dy: 4
}

function movePaddle(paddle, y){
    paddle.y = y;

    if(paddle.y < 0) paddle.y = 0;
    if(paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

function moveBall(){
    if (isPaused) return; //game is paused

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy *= -1;
    }

    if (
        ball.x - ball.radius <= userPaddle.x + userPaddle.width && 
        ball.x + ball.radius >= userPaddle.x                    &&
        ball.y + ball.radius >= userPaddle.y                    &&
        ball.y - ball.radius <= userPaddle.y + userPaddle.height
    ) {
        ball.dx *= -1;
        ball.speed++;
        let collidePoint = ball.y - (userPaddle.y + userPaddle.height / 2);
        collidePoint = collidePoint / (userPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.dy = ball.speed * Math.sin(angleRad);
        adjustAiTarget();
    }

    if( ball.y + ball.radius < aiPaddle.x + aiPaddle.width  &&
        ball.x + ball.radius > aiPaddle.x                   &&
        ball.y - ball.radius < aiPaddle.y + aiPaddle.height &&
        ball.y + ball.radius > aiPaddle.y
    ){
        ball.dx *= -1;
        
        ball.speed++;
        let collidePoint = ball.y - (aiPaddle.y + aiPaddle.height/2);
        collidePoint = collidePoint / (aiPaddle.height/2);
        let angleRad = (Math.PI / 4)* collidePoint;
        ball.dy = ball.speed * Math.sin(angleRad);
        adjustAiTarget();
    }

    if(ball.x + ball.radius > canvas.width){
        scores[0]++;
        resetBall(-1);
    }

    if(ball.x + ball.radius < 0){
        scores[1]++;
        resetBall(1);
    }
}

function resetBall(direction){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 4;

    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dx = direction * ball.speed;
}

let aiTargetY = canvas.height/2;
function adjustAiTarget(){
    aiTargetY = ball.y + (Math.random() * 60 -30);
}

function aiLogic(){
    if (isPaused) return;

    if(ball.dx > 0){
        adjustAiTarget();
    }

    if(aiPaddle.y + aiPaddle.height/2 < aiTargetY){
        movePaddle(aiPaddle, aiPaddle.y + aiPaddle.dy);
    }
    else{
        movePaddle(aiPaddle, aiPaddle.y - aiPaddle.dy);
    }
}

function update(){
    aiLogic();
    draw();
    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", (e) =>{
    if (isPaused) return;
    let rect = canvas.getBoundingClientRect();
    let y = e.clientY - rect.top;
    movePaddle(userPaddle, y - userPaddle.height/2);
});

function draw(){
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.fillRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
    ctx.fillStyle = "#FFF";
    ctx.fill();

    ctx.fillText(scores[0], canvas.width/4, 30);
    ctx.fillText(scores[1], (3*(canvas.width))/4, 30);

    moveBall();
}

function togglePause(){
    isPaused = !isPaused;
    pauseButton.textContext = isPuased ? "Resume" : "Pause";
}

pauseButton.addEventListener("click", togglePause);

update();