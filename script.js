
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
let enemyCells = [];

function spawnEnemies() {
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * (30 - 10) + 10;
        let color = 'red';
        enemyCells.push(new Cell(x, y, radius, color));
    }
}

function moveEnemies() {
    enemyCells.forEach(enemy => {
        enemy.x += Math.random() * 4 - 2;
        enemy.y += Math.random() * 4 - 2;
    });
}

function checkCollisions() {
    enemyCells.forEach(enemy => {
        let dx = playerCell.x - enemy.x;
        let dy = playerCell.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < playerCell.radius + enemy.radius) {
            alert('Game Over!');
            location.reload();
        }
    });
}

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
    moveEnemies();
    enemyCells.forEach(enemy => enemy.draw());
    playerCell.draw();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

spawnEnemies();
gameLoop();
