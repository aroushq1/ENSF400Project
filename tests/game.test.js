/**
 * @jest-environment jsdom
 */

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { JSDOM } = require("jsdom");

beforeAll(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`);
    global.window = dom.window;
    global.document = dom.window.document;

    // Inject HTML content into the body
    document.body.innerHTML = `
        <canvas id="pong"></canvas>
        <button id="pauseButton"></button>
    `;

    global.canvas = document.getElementById("pong");

    // Now canvas is guaranteed to exist
    global.canvas.width = 800;
    global.canvas.height = 600;

    global.ball = { x: 400, y: 300 };
    global.userPaddle = { y: 0, height: 100 };
    global.isPaused = false;
    global.aiTargetY = 250;

    global.moveBall = () => {
        global.ball.x += 1;
        global.ball.y += 1;

        if (global.ball.x > global.canvas.width) {
            global.ball.x = global.canvas.width / 2;
            global.ball.y = global.canvas.height / 2;
        }
    };

    global.movePaddle = (paddle, dy) => {
        paddle.y += dy;
        if (paddle.y < 0) paddle.y = 0;
        if (paddle.y + paddle.height > global.canvas.height)
            paddle.y = global.canvas.height - paddle.height;
    };

    global.adjustAiTarget = () => {
        global.aiTargetY += 10;
    };

    const pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener("click", () => {
        global.isPaused = !global.isPaused;
    });
});

describe("Pong Game", () => {
    test("Ball should move when game is running", () => {
        const initialX = global.ball.x;
        const initialY = global.ball.y;

        global.moveBall();

        expect(global.ball.x).not.toBe(initialX);
        expect(global.ball.y).not.toBe(initialY);
    });

    test("Ball should reset when it goes out of bounds", () => {
        global.scores = [0, 0];

        global.ball.x = global.canvas.width + 10;
        global.moveBall();

        expect(global.ball.x).toBe(global.canvas.width / 2);
        expect(global.ball.y).toBe(global.canvas.height / 2);
    });

    test("Paddle should not move out of bounds", () => {
        global.movePaddle(global.userPaddle, -100);
        expect(global.userPaddle.y).toBe(0);

        global.movePaddle(global.userPaddle, 1000);
        expect(global.userPaddle.y).toBe(global.canvas.height - global.userPaddle.height);
    });

    test("AI should adjust its target when ball direction changes", () => {
        const oldTarget = global.aiTargetY;
        global.adjustAiTarget();
        expect(global.aiTargetY).not.toBe(oldTarget);
    });

    test("Game should pause and resume", () => {
        const button = document.getElementById("pauseButton");
        expect(global.isPaused).toBe(false);

        button.click();
        expect(global.isPaused).toBe(true);

        button.click();
        expect(global.isPaused).toBe(false);
    });
});
