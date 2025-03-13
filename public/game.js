const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

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
    ball.x += ball.dx;
    ball.y += ball.dy;

    if( ball.y + ball.radius < userPaddle.x + userPaddle.width  &&
        ball.x + ball.radius > userPaddle.x                     &&
        ball.y - ball.radius < userPaddle.y + userPaddle.height &&
        ball.y + ball.radius > userPaddle.y
    ){
        ball.dx *= -1;
        
        ball.speed++;
        let collidePoint = ball.y - (userPaddle.y + userPaddle.height/2);
        collidePoint = collidePoint / (userPaddle.height/2);
        let angleRad = (Math.PI / 4)* collidePoint;
        ball.dy = ball.speed * Math.sin(angleRad);
        adjustAiTarget();
    }

    if( ball.y + ball.radius < aiPaddle.x + aiPaddle.width  &&
        ball.x + ball.radius > aiPaddle.x                     &&
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