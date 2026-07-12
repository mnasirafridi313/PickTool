const boardElement = document.getElementById("chess-board");
const turnDisplay = document.getElementById("turn-display");

let turn = "white";
let selectedSquare = null;
let validMoves = [];

const WHITE = ["♙","♖","♘","♗","♕","♔"];
const BLACK = ["♟","♜","♞","♝","♛","♚"];

let board = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

function isWhite(piece){
    return WHITE.includes(piece);
}

function isBlack(piece){
    return BLACK.includes(piece);
}

function inside(r,c){
    return r>=0 && r<8 && c>=0 && c<8;
}

function sameTeam(a,b){
    if(!a || !b) return false;
    return (isWhite(a)&&isWhite(b)) || (isBlack(a)&&isBlack(b));
}

function getValidMoves(r,c){
    const piece=board[r][c];
    if(!piece) return [];
    let moves=[];

    function addMove(nr,nc){
        if(!inside(nr,nc)) return;
        const target=board[nr][nc];
        if(!sameTeam(piece,target)){
            moves.push({r:nr,c:nc});
        }
    }

    switch(piece){
        case "♙":{
            if(inside(r-1,c) && board[r-1][c]==null){
                moves.push({r:r-1,c:c});
                if(r===6 && board[r-2][c]==null){
                    moves.push({r:r-2,c:c});
                }
            }
            if(inside(r-1,c-1) && isBlack(board[r-1][c-1])) moves.push({r:r-1,c:c-1});
            if(inside(r-1,c+1) && isBlack(board[r-1][c+1])) moves.push({r:r-1,c:c+1});
            break;
        }
        case "♟":{
            if(inside(r+1,c) && board[r+1][c]==null){
                moves.push({r:r+1,c:c});
                if(r===1 && board[r+2][c]==null){
                    moves.push({r:r+2,c:c});
                }
            }
            if(inside(r+1,c-1) && isWhite(board[r+1][c-1])) moves.push({r:r+1,c:c-1});
            if(inside(r+1,c+1) && isWhite(board[r+1][c+1])) moves.push({r:r+1,c:c+1});
            break;
        }
        case "♘":
        case "♞":{
            const jump=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            jump.forEach(m=> addMove(r+m[0],c+m[1]));
            break;
        }
        case "♔":
        case "♚":{
            for(let dr=-1;dr<=1;dr++){
                for(let dc=-1;dc<=1;dc++){
                    if(dr!==0 || dc!==0) addMove(r+dr,c+dc);
                }
            }
            break;
        }
        case "♖":
        case "♜": {
            const directions = [[-1,0],[1,0],[0,-1],[0,1]];
            directions.forEach(d => {
                let nr = r + d[0]; let nc = c + d[1];
                while (inside(nr,nc)) {
                    if (board[nr][nc] == null) moves.push({r:nr,c:nc});
                    else { if (!sameTeam(piece,board[nr][nc])) moves.push({r:nr,c:nc}); break; }
                    nr += d[0]; nc += d[1];
                }
            });
            break;
        }
        case "♗":
        case "♝": {
            const directions = [[-1,-1],[-1,1],[1,-1],[1,1]];
            directions.forEach(d => {
                let nr = r + d[0]; let nc = c + d[1];
                while (inside(nr,nc)) {
                    if (board[nr][nc] == null) moves.push({r:nr,c:nc});
                    else { if (!sameTeam(piece,board[nr][nc])) moves.push({r:nr,c:nc}); break; }
                    nr += d[0]; nc += d[1];
                }
            });
            break;
        }
        case "♕":
        case "♛": {
            const directions = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
            directions.forEach(d => {
                let nr = r + d[0]; let nc = c + d[1];
                while (inside(nr,nc)) {
                    if (board[nr][nc] == null) moves.push({r:nr,c:nc});
                    else { if (!sameTeam(piece,board[nr][nc])) moves.push({r:nr,c:nc}); break; }
                    nr += d[0]; nc += d[1];
                }
            });
            break;
        }
    }
    return moves;
}

function renderBoard(){
    boardElement.innerHTML="";
    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            const square=document.createElement("div");
            square.className="square "+(((r+c)%2===0)?"light":"dark");
            if(selectedSquare && selectedSquare.r===r && selectedSquare.c===c) square.classList.add("selected");
            if(validMoves.some(m=>m.r===r && m.c===c)) square.classList.add("valid-move");
            square.textContent=board[r][c] || "";
            square.onclick=function(){ handleSquareClick(r,c); };
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(r,c){
    const piece=board[r][c];
    if(selectedSquare){
        const legal=validMoves.find(m=>m.r===r && m.c===c);
        if(legal){
            board[r][c]=board[selectedSquare.r][selectedSquare.c];
            board[selectedSquare.r][selectedSquare.c]=null;
            turn=(turn==="white")?"black":"white";
            turnDisplay.textContent=turn.charAt(0).toUpperCase()+turn.slice(1);
            selectedSquare=null;
            validMoves=[];
            renderBoard();
            return;
        }
        if(piece){
            if((turn==="white" && isWhite(piece)) || (turn==="black" && isBlack(piece))){
                selectedSquare={r,c};
                validMoves=getValidMoves(r,c);
                renderBoard();
                return;
            }
        }
        selectedSquare=null;
        validMoves=[];
        renderBoard();
        return;
    }
    if(piece){
        if((turn==="white" && isWhite(piece)) || (turn==="black" && isBlack(piece))){
            selectedSquare={r,c};
            validMoves=getValidMoves(r,c);
        }
    }
    renderBoard();
}

renderBoard();
                       
