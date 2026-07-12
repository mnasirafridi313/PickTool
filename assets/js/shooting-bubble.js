const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B'];
let bubbles = [];
let projectile = { x: 175, y: 220, dx: 0, dy: 0, color: colors[0], active: false };
let gameActive = false;

// 1. Create the grid immediately
function createGrid() {
    bubbles = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            bubbles.push({ x: c * 42 + 25, y: r * 35 + 20, color: colors[Math.floor(Math.random() * colors.length)], active: true });
        }
    }
}

// 2. Draw function - draws the current state of the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Bubbles
    bubbles.forEach(b => {
        if (!b.active) return;
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, 15, 0, Math.PI*2); ctx.fill();
    });
    
    // Draw Shooter
    ctx.fillStyle = '#333';
    ctx.fillRect(165, 210, 20, 40);
    
    // Draw Projectile
    if (projectile.active) {
        projectile.x += projectile.dx; projectile.y += projectile.dy;
        ctx.fillStyle = projectile.color;
        ctx.beginPath(); ctx.arc(projectile.x, projectile.y, 15, 0, Math.PI*2); ctx.fill();
        
        // Wall bounce
        if (projectile.x < 15 || projectile.x > 335) projectile.dx *= -1;
        
        // Collision
        bubbles.forEach(b => {
            if (b.active && Math.hypot(projectile.x - b.x, projectile.y - b.y) < 30) {
                if (projectile.color === b.color) b.active = false;
                projectile.active = false;
                projectile.x = 175; projectile.y = 220;
            }
        });
        if (projectile.y < 0) { projectile.active = false; projectile.x = 175; projectile.y = 220; }
    }
    requestAnimationFrame(draw);
}

// 3. Start Timer Logic
function startGame(seconds) {
    gameActive = true;
    let timeLeft = seconds;
    const timerDisplay = document.getElementById('timer');
    clearInterval(window.timer);
    window.timer = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (timeLeft <= 0) { clearInterval(window.timer); gameActive = false; alert("Time's up!"); }
    }, 1000);
}

// Initialize on page load
createGrid();
draw();

// Firing
canvas.addEventListener('click', (e) => {
    if (projectile.active) return;
    const rect = canvas.getBoundingClientRect();
    const angle = Math.atan2((e.clientY - rect.top) - 220, (e.clientX - rect.left) - 175);
    projectile.dx = Math.cos(angle) * 6;
    projectile.dy = Math.sin(angle) * 6;
    projectile.color = colors[Math.floor(Math.random() * colors.length)];
    projectile.active = true;
});
