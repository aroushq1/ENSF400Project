/**
 * @jest-environment jsdom
 */

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require("jsdom");


beforeEach(() => {
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM(`<!DOCTYPE html><html><body><canvas id="pong" width="800" height="600"></canvas></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;

    // Ensure canvas exists before using getContext
    global.canvas = document.getElementById("pong");
    global.ctx = global.canvas.getContext("2d");

    // Mock any other objects you may need
    global.isPaused = false;
    global.ball = {
        x: 400,
        y: 300,
        radius: 10,
        speed: 4,
        dx: 4,
        dy: 4
    };
    global.userPaddle = {
        x: 10,
        y: 200,
        width: 10,
        height: 80,
        dy: 4
    };
    global.aiPaddle = {
        x: 780,
        y: 200,
        width: 10,
        height: 80,
        dy: 4
    };
    global.scores = [0, 0];
    global.aiTargetY = 300;
});


describe("Pong Game", () => {
    test("Ball should move when game is running", () => {
        const initialX = global.ball.x;
        const initialY = global.ball.y;

        global.moveBall();
x
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

        button.click(); // Pause
        expect(global.isPaused).toBe(true);

        button.click(); // Resume
        expect(global.isPaused).toBe(false);
    });
});
