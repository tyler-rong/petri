
class Cell {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerCell = new Cell(canvas.width / 2, canvas.height / 2, 30, 'blue');

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function movePlayerCell() {
    const dx = mouse.x - playerCell.x;
    const dy = mouse.y - playerCell.y;
    playerCell.x += dx * 0.1;
    playerCell.y += dy * 0.1;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayerCell();
    playerCell.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
