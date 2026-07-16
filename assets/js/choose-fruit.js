// Expanded list including emojis and fruits
const fruits = [
    "🍎", "🍊", "🍇", "🍓", "🍍", "🥝", "🍉", "🍒", 
    "😡", "😎", "⚽", "🌐", "☢️", "🧭", "🌸", "💮", 
    "📕", "🌚", "🪖", "😅", "😄", "😃", "🤣", "💲", "😘"
];

let board = [];
let collection = [];

function initGame() {
    // Generate a board with 36 random items from the expanded list
    let totalTiles = 36;
    board = [];
    for (let i = 0; i < totalTiles; i++) {
        // Pick random items to ensure variety in the 50 hidden levels
        board.push(fruits[Math.floor(Math.random() * fruits.length)]);
    }
    renderBoard();
}

function renderBoard() {
    const boardEl = document.getElementById('game-board');
    boardEl.innerHTML = '';
    board.forEach((item, index) => {
        if (item === null) return; // Skip items already collected
        let tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = item;
        tile.onclick = () => selectTile(index);
        boardEl.appendChild(tile);
    });
}
// ... rest of your functions (selectTile, updateCollection, shuffleBoard) remain the same
