/**
 * @jest-environment jsdom
 */

const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require("jsdom");


beforeEach(() => {
    // Set up a virtual DOM for testing
    const dom = new JSDOM(`
        <canvas id="pong" width="800" height="400"></canvas>
        <button id="pauseButton">Pause</button>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
    global.canvas = document.getElementById("pong");
    global.ctx = canvas.getContext("2d");

    // Re-require the game script after setting up the DOM
    jest.resetModules();
    require("../public/game");
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

        global.ball.x = global.canvas.width + 10; // Simulate scoring
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

        button.click(); // Pause
        expect(global.isPaused).toBe(true);

        button.click(); // Resume
        expect(global.isPaused).toBe(false);
    });
});
