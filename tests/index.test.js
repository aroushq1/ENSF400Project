const fs = require('fs');
const path = require('path');

describe('Index HTML', () => {
    let html;

    beforeAll(() => {
        html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should have the correct page title', () => {
        const title = document.title;
        expect(title).toBe('Play Pong w/ AI');
    });

    it('should contain a canvas element with the id "pong"', () => {
        const canvas = document.getElementById('pong');
        expect(canvas).not.toBeNull();
        expect(canvas.tagName).toBe('CANVAS');
    });

    it('should have a pause button', () => {
        const pauseButton = document.getElementById('pauseButton');
        expect(pauseButton).not.toBeNull();
        expect(pauseButton.tagName).toBe('BUTTON');
    });

    it('should have a heading "PlayPongW/AI"', () => {
        const heading = document.querySelector('h1');
        expect(heading).not.toBeNull();
        expect(heading.textContent).toBe('PlayPongW/AI');
    });

    it('should have a section with the class "game-info"', () => {
        const gameInfoSection = document.querySelector('.game-info');
        expect(gameInfoSection).not.toBeNull();
    });

    it('should contain a footer with copyright information', () => {
        const footer = document.querySelector('footer');
        expect(footer).not.toBeNull();
        expect(footer.textContent).toContain('Muhammed Umar Khan');
    });
});
