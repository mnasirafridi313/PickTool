const boardElement = document.getElementById('chess-board');
const turnDisplay = document.getElementById('turn-display');
let turn = 'white';
let selectedSquare = null;

// Clearly define piece sets
const whitePieces = ['♙', '♖', '♘', '♗', '♕', '♔'];
const blackPieces = ['♟', '♜', '♞', '♝', '♛', '♚'];

let board = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

function isWhite(p) { return whitePieces.includes(p); }
function isBlack(p) { return blackPieces.includes(p); }

function isValidMove(from, to) {
    const piece = board[from.r][from.c];
    const target = board[to.r][to.c];
    
    // Cannot capture own pieces
    if (target) {
        if (isWhite(piece) && isWhite(target)) return false;
        if (isBlack(piece) && isBlack(target)) return false;
    }

    const dr = to.r - from.r;
    const dc = to.c - from.c;
    const pType = piece.toLowerCase();

    // Movement Rules
    if (pType === '♟' || pType === '♙') { // Pawn
        const direction = isWhite(piece) ? -1 : 1;
        // Move forward
        if (dc === 0 && target === null && dr === direction) return true;
        // Capture diagonally
        if (Math.abs(dc) === 1 && dr === direction && target !== null) return true;
        return false;
    }
    if (pType === '♞' || pType === '♘') { // Knight
        return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    }
    if (pType === '♚' || pType === '♔') { // King
        return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    }
    if (pType === '♜' || pType === '♖') { // Rook
        return dr === 0 || dc === 0;
    }
    if (pType === '♝' || pType === '♗') { // Bishop
        return Math.abs(dr) === Math.abs(dc);
    }
    if (pType === '♛' || pType === '♕') { // Queen
        return dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    }
    return false;
}

function getValidMoves(r, c) {
    let moves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isValidMove({r, c}, {r: i, c: j})) moves.push({r: i, c: j});
        }
    }
    return moves;
}

function renderBoard() {
    boardElement.innerHTML = '';
    const validMoves = selectedSquare ? getValidMoves(selectedSquare.r, selectedSquare.c) : [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) square.classList.add('selected');
            if (validMoves.some(m => m.r === r && m.c === c)) square.classList.add('valid-move');
            
            square.innerText = board[r][c] || '';
            square.onclick = () => handleSquareClick(r, c);
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(r, c) {
    const piece = board[r][c];

    // Select piece
    if (!selectedSquare && piece) {
        if ((turn === 'white' && isWhite(piece)) || (turn === 'black' && isBlack(piece))) {
            selectedSquare = { r, c };
            renderBoard();
        }
    } 
    // Move piece
    else if (selectedSquare) {
        if (isValidMove(selectedSquare, {r, c})) {
            board[r][c] = board[selectedSquare.r][selectedSquare.c];
            board[selectedSquare.r][selectedSquare.c] = null;
            turn = (turn === 'white') ? 'black' : 'white';
            turnDisplay.innerText = turn.charAt(0).toUpperCase() + turn.slice(1);
        }
        selectedSquare = null;
        renderBoard();
    }
}

renderBoard();
        
