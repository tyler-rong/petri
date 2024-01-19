
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

class Laser {
    constructor(x, y, velocity) {
        this.x = x - 2.5;
        this.y = y;
        this.velocity = velocity;
        this.width = 5;
        this.height = 10;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.y += this.velocity;
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerCell = new Cell(canvas.width / 2, canvas.height / 2, 30, 'blue');
let enemyCells = [];
let lasers = [];
let score = 0;
let lastTime = Date.now();

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
        const speed = 5;
        enemy.x += (Math.random() * 2 * speed - speed);
        enemy.y += (Math.random() * 2 * speed - speed);
    });
}

function checkCollisions() {
    enemyCells.forEach((enemy, enemyIndex) => {
        let dx = playerCell.x - enemy.x;
        let dy = playerCell.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < playerCell.radius + enemy.radius) {
            alert('Game Over!');
            location.reload();
        }
    });
}

function updateScore() {
    const currentTime = Date.now();
    score += (currentTime - lastTime) / 1000;
    lastTime = currentTime;
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score.toFixed(1)}`, canvas.width - 150, 30);
}

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        const velocity = -5;
        lasers.push(new Laser(playerCell.x, playerCell.y - playerCell.radius, velocity));
    }
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

    lasers.forEach((laser, laserIndex) => {
        laser.update();
        if (laser.y + laser.height < 0) {
            setTimeout(() => {
                lasers.splice(laserIndex, 1);
            }, 0);
        }

        enemyCells.forEach((enemy, enemyIndex) => {
            if (laser.x < enemy.x + enemy.radius &&
                laser.x + laser.width > enemy.x - enemy.radius &&
                laser.y < enemy.y + enemy.radius &&
                laser.y + laser.height > enemy.y - enemy.radius) {
                setTimeout(() => {
                    enemyCells.splice(enemyIndex, 1);
                    lasers.splice(laserIndex, 1);
                }, 0);
            }
        });
    });

    playerCell.draw();
    checkCollisions();

    updateScore();
    drawScore();

    requestAnimationFrame(gameLoop);
}

spawnEnemies();
gameLoop();
