const COLS = 10;
const ROWS = 10;
let grid = [];
let score = 0;
let tilesLeft = 0;
let selected = null;

const fruits = ['🍎','🍌','🍉','🍇','🍓','🍒','🍍','🍊','🍋','🥝','🥥','🍈','🍑','🥭','🍐','🍏'];

function initGame() {
    score = 0;
    tilesLeft = 64;
    selected = null;
    
    document.getElementById('score').innerText = score;
    
    // Create the logical grid
    grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    
    // Create the deck of fruits
    let deck = [];
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 4; j++) deck.push(fruits[i]);
    }
    deck.sort(() => Math.random() - 0.5);
    
    const board = document.getElementById('game-board');
    if (!board) return; 
    
    board.innerHTML = ''; // Clear previous board
    
    let idx = 0;
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            const fruit = deck[idx++];
            grid[y][x] = fruit;
            
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${x}-${y}`;
            tile.innerText = fruit;
            tile.onclick = () => clickTile(x, y);
            
            board.appendChild(tile);
        }
    }
}

function clickTile(x, y) {
    if (grid[y][x] === null) return;

    if (!selected) {
        selected = {x, y};
        document.getElementById(`tile-${x}-${y}`).classList.add('selected');
        return;
    }

    if (selected.x === x && selected.y === y) {
        document.getElementById(`tile-${x}-${y}`).classList.remove('selected');
        selected = null;
        return;
    }

    if (grid[selected.y][selected.x] === grid[y][x]) {
        if (canConnect(selected.x, selected.y, x, y)) {
            document.getElementById(`tile-${selected.x}-${selected.y}`).className = 'tile empty';
            document.getElementById(`tile-${selected.x}-${selected.y}`).innerText = '';
            document.getElementById(`tile-${x}-${y}`).className = 'tile empty';
            document.getElementById(`tile-${x}-${y}`).innerText = '';
            
            grid[selected.y][selected.x] = null;
            grid[y][x] = null;
            
            selected = null;
            score += 10;
            document.getElementById('score').innerText = score;
            
            tilesLeft -= 2;
            if (tilesLeft === 0) {
                setTimeout(() => alert("You Win! Final Score: " + score), 300);
            }
            return;
        }
    }

    document.getElementById(`tile-${selected.x}-${selected.y}`).classList.remove('selected');
    selected = {x, y};
    document.getElementById(`tile-${x}-${y}`).classList.add('selected');
}

function checkLine(x1, y1, x2, y2) {
    if (x1 !== x2 && y1 !== y2) return false;
    if (x1 === x2) {
        let min = Math.min(y1, y2);
        let max = Math.max(y1, y2);
        for (let y = min + 1; y < max; y++) {
            if (grid[y][x1] !== null) return false;
        }
        return true;
    } else {
        let min = Math.min(x1, x2);
        let max = Math.max(x1, x2);
        for (let x = min + 1; x < max; x++) {
            if (grid[y1][x] !== null) return false;
        }
        return true;
    }
}

function canConnect(x1, y1, x2, y2) {
    if (checkLine(x1, y1, x2, y2)) return true;

    if (grid[y2][x1] === null && checkLine(x1, y1, x1, y2) && checkLine(x1, y2, x2, y2)) return true;
    if (grid[y1][x2] === null && checkLine(x1, y1, x2, y1) && checkLine(x2, y1, x2, y2)) return true;

    for (let i = -1; i <= 1; i += 2) {
        let x = x1 + i;
        while (x >= 0 && x < COLS && grid[y1][x] === null) {
            if (grid[y2][x] === null && checkLine(x, y1, x, y2) && checkLine(x, y2, x2, y2)) return true;
            x += i;
        }
        let y = y1 + i;
        while (y >= 0 && y < ROWS && grid[y][x1] === null) {
            if (grid[y][x2] === null && checkLine(x1, y, x2, y) && checkLine(x2, y, x2, y2)) return true;
            y += i;
        }
    }
    return false;
}

function shuffleGrid() {
    let remaining = [];
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            if (grid[y][x] !== null) remaining.push(grid[y][x]);
        }
    }
    if (remaining.length === 0) return;
    
    remaining.sort(() => Math.random() - 0.5);
    let idx = 0;
    
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            if (grid[y][x] !== null) {
                grid[y][x] = remaining[idx++];
                document.getElementById(`tile-${x}-${y}`).innerText = grid[y][x];
            }
        }
    }
    
    if (selected) {
        document.getElementById(`tile-${selected.x}-${selected.y}`).classList.remove('selected');
        selected = null;
    }
}

// Ensures the JavaScript waits for the HTML to fully load before running
window.addEventListener('load', initGame);
            
