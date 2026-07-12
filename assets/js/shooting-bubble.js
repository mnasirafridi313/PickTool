const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B'];
let bubbles = [];
let projectile = null;
let gameActive = false;

function createGrid() {
    bubbles = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            bubbles.push({ x: c * 42 + 25, y: r * 35 + 20, color: colors[Math.floor(Math.random() * colors.length)], active: true });
        }
    }
}

function startGame(seconds) {
    createGrid();
    projectile = { x: 175, y: 220, dx: 0, dy: 0, color: colors[Math.floor(Math.random() * colors.length)], active: false };
    gameActive = true;
    
    // Timer Logic
    let timeLeft = seconds;
    const timerDisplay = document.getElementById('timer');
    clearInterval(window.timer);
    window.timer = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (timeLeft <= 0) { clearInterval(window.timer); gameActive = false; alert("Game Over!"); }
    }, 1000);
    draw();
}

canvas.addEventListener('click', (e) => {
    if (!gameActive || projectile.active) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate direction
    const angle = Math.atan2(mouseY - 220, mouseX - 175);
    projectile.dx = Math.cos(angle) * 5;
    projectile.dy = Math.sin(angle) * 5;
    projectile.active = true;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Bubbles
    bubbles.forEach(b => {
        if (!b.active) return;
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, 12, 0, Math.PI*2); ctx.fill();
    });
    
    // Draw Shooter
    ctx.fillStyle = '#333';
    ctx.fillRect(165, 210, 20, 40);
    
    // Draw Projectile
    if (projectile.active) {
        projectile.x += projectile.dx; projectile.y += projectile.dy;
        ctx.fillStyle = projectile.color;
        ctx.beginPath(); ctx.arc(projectile.x, projectile.y, 12, 0, Math.PI*2); ctx.fill();
        
        // Wall bounce
        if (projectile.x < 0 || projectile.x > 350) projectile.dx *= -1;
        
        // Simple Collision
        bubbles.forEach(b => {
            if (b.active && Math.hypot(projectile.x - b.x, projectile.y - b.y) < 24) {
                if (projectile.color === b.color) b.active = false; // Pop
                projectile.active = false;
                projectile.x = 175; projectile.y = 220;
                projectile.color = colors[Math.floor(Math.random() * colors.length)];
            }
        });
        if (projectile.y < 0) { projectile.active = false; projectile.x = 175; projectile.y = 220; }
    }
    
    if (gameActive) requestAnimationFrame(draw);
}

// Initial draw
ctx.fillStyle = "#333"; ctx.fillText("Select time to start", 120, 125);
