/* PART 1 OF 5 - STATE & SETUP */

const GRID_SIZE = 17; // 9 cells + 8 walls
let board = document.getElementById('game-board');
let statusMsg = document.getElementById('status-msg');

let playerRed = { id: 'red', r: 16, c: 8, walls: 10, goalRow: 0 };
let playerBlue = { id: 'blue', r: 0, c: 8, walls: 10, goalRow: 16 };
let currentPlayer = playerRed;
let currentAction = 'move'; // can be 'move', 'wall-h', 'wall-v'

// Keep track of placed walls to prevent overlapping
let placedWalls = new Set();

// Initialize the visual grid
function createBoard() {
    board.innerHTML = '';
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            let div = document.createElement('div');
            div.dataset.r = r;
            div.dataset.c = c;
            div.id = `cell-${r}-${c}`;

            if (r % 2 === 0 && c % 2 === 0) {
                // This is a playable cell
                div.className = 'cell';
                div.onclick = () => handleCellClick(r, c);
            } else if (r % 2 !== 0 && c % 2 === 0) {
                // Horizontal wall slot
                div.className = 'wall-slot';
                div.onclick = () => handleWallClick(r, c, 'h');
            } else if (r % 2 === 0 && c % 2 !== 0) {
                // Vertical wall slot
                div.className = 'wall-slot';
                div.onclick = () => handleWallClick(r, c, 'v');
            } else {
                // Intersection between four cells (cannot be clicked directly)
                div.className = 'intersection';
            }
            board.appendChild(div);
        }
    }
    renderPlayers();
}

function renderPlayers() {
    // Clear old positions
    document.querySelectorAll('.player').forEach(el => el.remove());
    
    // Draw Red
    let redCell = document.getElementById(`cell-${playerRed.r}-${playerRed.c}`);
    let redDiv = document.createElement('div');
    redDiv.className = 'player player-red';
    redCell.appendChild(redDiv);

    // Draw Blue
    let blueCell = document.getElementById(`cell-${playerBlue.r}-${playerBlue.c}`);
    let blueDiv = document.createElement('div');
    blueDiv.className = 'player player-blue';
    blueCell.appendChild(blueDiv);
}

// Set up UI buttons
function setAction(action) {
    currentAction = action;
    document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
    
    if(action === 'move') document.getElementById('btn-move').classList.add('active');
    if(action === 'wall-h') document.getElementById('btn-wall-h').classList.add('active');
    if(action === 'wall-v') document.getElementById('btn-wall-v').classList.add('active');
}

// Start Game
createBoard();
        /* PART 2 OF 5 - MOVEMENT LOGIC & TURN SWITCHING */

let gameMode = 'pvp'; // Default mode

// Override the wall counts to 6 based on your new rule
playerRed.walls = 6;
playerBlue.walls = 6;

function setGameMode(mode) {
    gameMode = mode;
    // We will build a full resetGame() function in a later part, 
    // but for now, switching modes sets the variable.
}

function handleCellClick(targetR, targetC) {
    if (currentAction !== 'move') return;

    let r = currentPlayer.r;
    let c = currentPlayer.c;

    // Because of wall slots, valid moves are jumping 2 grid indexes (e.g., from row 0 to row 2)
    let isAdjacent = false;
    let crossSlotR = r;
    let crossSlotC = c;

    if (Math.abs(targetR - r) === 2 && targetC === c) {
        isAdjacent = true;
        crossSlotR = (targetR + r) / 2; // The horizontal wall slot between them
    } else if (Math.abs(targetC - c) === 2 && targetR === r) {
        isAdjacent = true;
        crossSlotC = (targetC + c) / 2; // The vertical wall slot between them
    }

    if (!isAdjacent) {
        statusMsg.innerText = "Invalid move! You can only move 1 square.";
        return;
    }

    // Check if opponent is blocking the square (cannot step on them)
    let opponent = currentPlayer.id === 'red' ? playerBlue : playerRed;
    if (targetR === opponent.r && targetC === opponent.c) {
        statusMsg.innerText = "Opponent is blocking that square!";
        return; 
    }

    // Check if a wall is blocking the path
    let isBlocked = false;
    if (targetR === r) {
        // Moving left/right: check vertical walls
        if (placedWalls.has(`v-${r}-${crossSlotC}`) || placedWalls.has(`v-${r-2}-${crossSlotC}`)) {
            isBlocked = true;
        }
    } else if (targetC === c) {
        // Moving up/down: check horizontal walls
        if (placedWalls.has(`h-${crossSlotR}-${c}`) || placedWalls.has(`h-${crossSlotR}-${c-2}`)) {
            isBlocked = true;
        }
    }

    if (isBlocked) {
        statusMsg.innerText = "A wall is blocking your path!";
        return;
    }

    // Move is valid! Move the player.
    currentPlayer.r = targetR;
    currentPlayer.c = targetC;
    
    renderPlayers();
    checkWin();
}

function checkWin() {
    if (currentPlayer.r === currentPlayer.goalRow) {
        statusMsg.innerText = `🎉 ${currentPlayer.id.toUpperCase()} WINS!`;
        statusMsg.style.color = "#2ecc71";
        board.style.pointerEvents = 'none'; // Stop game
    } else {
        switchTurn();
    }
}

function switchTurn() {
    currentPlayer = currentPlayer.id === 'red' ? playerBlue : playerRed;
    
    // Update UI panels to show whose turn it is
    if (currentPlayer.id === 'red') {
        document.getElementById('red-panel').style.opacity = '1';
        document.getElementById('blue-panel').style.opacity = '0.5';
        statusMsg.innerText = "Red's Turn";
        statusMsg.style.color = "#d93838";
    } else {
        document.getElementById('red-panel').style.opacity = '0.5';
        document.getElementById('blue-panel').style.opacity = '1';
        statusMsg.innerText = "Blue's Turn";
        statusMsg.style.color = "#2d5aa0";
        
        // If playing vs Bot, trigger bot logic
        if (gameMode === 'pve') {
            statusMsg.innerText = "Bot is thinking...";
            setTimeout(botMove, 600); // Bot move logic will be in a later part
        }
    }
    
    // Always default back to "Move Ball" action when turn switches
    setAction('move');
            }
/* PART 3 OF 5 - WALL PLACEMENT LOGIC */

function handleWallClick(r, c, type) {
    // If they click a wall slot, auto-switch the action button if needed
    if (type === 'h' && currentAction !== 'wall-h') setAction('wall-h');
    if (type === 'v' && currentAction !== 'wall-v') setAction('wall-v');

    if (currentPlayer.walls <= 0) {
        statusMsg.innerText = "You have no walls left! You must move.";
        return;
    }

    // A wall covers 3 grid spaces (Slot 1, Intersection, Slot 2)
    let s1, s2, intersection;

    if (type === 'h') {
        if (c + 2 >= GRID_SIZE) return; // Prevent going off the right edge
        s1 = `h-${r}-${c}`;
        intersection = `i-${r}-${c+1}`;
        s2 = `h-${r}-${c+2}`;
    } else {
        if (r + 2 >= GRID_SIZE) return; // Prevent going off the bottom edge
        s1 = `v-${r}-${c}`;
        intersection = `i-${r+1}-${c}`;
        s2 = `v-${r+2}-${c}`;
    }

    // Check for overlaps (cannot place over an existing wall or cross one)
    if (placedWalls.has(s1) || placedWalls.has(s2) || placedWalls.has(intersection)) {
        statusMsg.innerText = "Invalid! Walls cannot overlap or cross.";
        return;
    }

    // TEMPORARILY place the wall in our logic tracker
    placedWalls.add(s1);
    placedWalls.add(s2);
    placedWalls.add(intersection);

    // CHECK PATHFINDING: We will build hasValidPath() in Part 4!
    // This prevents players from completely boxing someone in.
    if (typeof hasValidPath === "function") {
        if (!hasValidPath(playerRed) || !hasValidPath(playerBlue)) {
            // If it traps a player, undo the placement
            placedWalls.delete(s1);
            placedWalls.delete(s2);
            placedWalls.delete(intersection);
            statusMsg.innerText = "Rule Break: You cannot completely block a player's path!";
            return;
        }
    }

    // PERMANENTLY place the wall
    currentPlayer.walls--;
    document.getElementById(`${currentPlayer.id}-walls`).innerText = currentPlayer.walls;

    // Draw the wall visually on the grid by coloring all 3 segments
    if (type === 'h') {
        document.getElementById(`cell-${r}-${c}`).classList.add('wall-placed');
        document.getElementById(`cell-${r}-${c+1}`).classList.add('wall-placed');
        document.getElementById(`cell-${r}-${c+2}`).classList.add('wall-placed');
    } else {
        document.getElementById(`cell-${r}-${c}`).classList.add('wall-placed');
        document.getElementById(`cell-${r+1}-${c}`).classList.add('wall-placed');
        document.getElementById(`cell-${r+2}-${c}`).classList.add('wall-placed');
    }

    switchTurn();
            }
        /* PART 4 OF 5 - PATHFINDING (PREVENTING TRAPS) */

// Helper function to check if a specific step is blocked by a wall
function isPathBlocked(r1, c1, r2, c2) {
    if (r1 === r2) {
        // Moving left/right
        let crossC = (c1 + c2) / 2;
        return placedWalls.has(`v-${r1}-${crossC}`) || placedWalls.has(`v-${r1-2}-${crossC}`);
    } else if (c1 === c2) {
        // Moving up/down
        let crossR = (r1 + r2) / 2;
        return placedWalls.has(`h-${crossR}-${c1}`) || placedWalls.has(`h-${crossR}-${c1-2}`);
    }
    return true; 
}

// Flood-fill (BFS) to check if a player can still reach their goal row
function hasValidPath(player) {
    let queue = [{ r: player.r, c: player.c }];
    let visited = new Set();
    visited.add(`${player.r},${player.c}`);

    // The 4 directions a player can move (jumping 2 grid indices over walls)
    let directions = [
        { dr: -2, dc: 0 }, // Up
        { dr: 2, dc: 0 },  // Down
        { dr: 0, dc: -2 }, // Left
        { dr: 0, dc: 2 }   // Right
    ];

    while (queue.length > 0) {
        let curr = queue.shift();

        // If the flood-fill reaches the goal row, a path exists!
        if (curr.r === player.goalRow) {
            return true;
        }

        for (let dir of directions) {
            let nextR = curr.r + dir.dr;
            let nextC = curr.c + dir.dc;

            // Check if the next step is inside the board limits
            if (nextR >= 0 && nextR < GRID_SIZE && nextC >= 0 && nextC < GRID_SIZE) {
                let key = `${nextR},${nextC}`;
                
                // If not visited yet AND not blocked by a wall, add it to the search queue
                if (!visited.has(key) && !isPathBlocked(curr.r, curr.c, nextR, nextC)) {
                    visited.add(key);
                    queue.push({ r: nextR, c: nextC });
                }
            }
        }
    }
    
    // If the queue empties and we never hit the goal row, they are trapped.
    return false;
            }
        /* PART 5 OF 5 - BOT AI & GAME RESET */

// Bot Logic: Find the absolute shortest path to the goal
function getNextBestMove(player) {
    let queue = [{ r: player.r, c: player.c, path: [] }];
    let visited = new Set();
    visited.add(`${player.r},${player.c}`);

    // Down, Up, Left, Right
    let directions = [
        { dr: 2, dc: 0 }, { dr: -2, dc: 0 }, { dr: 0, dc: -2 }, { dr: 0, dc: 2 }
    ];

    while (queue.length > 0) {
        let curr = queue.shift();

        // If we found the goal, return the very first step in that path
        if (curr.r === player.goalRow) {
            return curr.path[0]; 
        }

        for (let dir of directions) {
            let nextR = curr.r + dir.dr;
            let nextC = curr.c + dir.dc;

            if (nextR >= 0 && nextR < GRID_SIZE && nextC >= 0 && nextC < GRID_SIZE) {
                let key = `${nextR},${nextC}`;
                
                // If not blocked by wall
                if (!visited.has(key) && !isPathBlocked(curr.r, curr.c, nextR, nextC)) {
                    // Check to avoid stepping on the opponent
                    let opponent = player.id === 'red' ? playerBlue : playerRed;
                    if (nextR !== opponent.r || nextC !== opponent.c) {
                        visited.add(key);
                        let newPath = [...curr.path, { r: nextR, c: nextC }];
                        queue.push({ r: nextR, c: nextC, path: newPath });
                    }
                }
            }
        }
    }
    return null;
}

// Triggers when it's the Bot's turn
function botMove() {
    if (currentPlayer.id !== 'blue' || gameMode !== 'pve') return;

    let nextMove = getNextBestMove(playerBlue);

    if (nextMove) {
        playerBlue.r = nextMove.r;
        playerBlue.c = nextMove.c;
        renderPlayers();
        checkWin();
    }
}

// Reset the entire game board and variables
function resetGame() {
    playerRed = { id: 'red', r: 16, c: 8, walls: 6, goalRow: 0 };
    playerBlue = { id: 'blue', r: 0, c: 8, walls: 6, goalRow: 16 };
    currentPlayer = playerRed;
    
    placedWalls.clear();
    
    document.getElementById('red-walls').innerText = '6';
    document.getElementById('blue-walls').innerText = '6';
    document.getElementById('red-panel').style.opacity = '1';
    document.getElementById('blue-panel').style.opacity = '0.5';
    
    statusMsg.innerText = "Red's Turn";
    statusMsg.style.color = "#d93838";
    board.style.pointerEvents = 'auto'; // Re-enable clicks if game was won
    
    setAction('move');
    createBoard();
}

// Hook the reset function into the dropdown menu so changing modes resets the board
document.getElementById('game-mode').addEventListener('change', function(e) {
    setGameMode(e.target.value);
    resetGame();
});
                        
