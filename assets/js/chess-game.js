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
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function sameTeam(a,b){
    if(!a || !b) return false;
    return (isWhite(a) && isWhite(b)) || (isBlack(a) && isBlack(b));
}

function clearPath(fr,fc,tr,tc){

    const dr = Math.sign(tr - fr);
    const dc = Math.sign(tc - fc);

    let r = fr + dr;
    let c = fc + dc;

    while(r !== tr || c !== tc){

        if(board[r][c] !== null){
            return false;
        }

        r += dr;
        c += dc;
    }

    return true;
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

case "♙":

if(inside(r-1,c) && board[r-1][c]==null){

moves.push({r:r-1,c:c});

if(r===6 && board[r-2][c]==null){
moves.push({r:r-2,c:c});
}

}

if(inside(r-1,c-1) && isBlack(board[r-1][c-1])){
moves.push({r:r-1,c:c-1});
}

if(inside(r-1,c+1) && isBlack(board[r-1][c+1])){
moves.push({r:r-1,c:c+1});
}

break;

case "♟":

if(inside(r+1,c) && board[r+1][c]==null){

moves.push({r:r+1,c:c});

if(r===1 && board[r+2][c]==null){
moves.push({r:r+2,c:c});
}

}

if(inside(r+1,c-1) && isWhite(board[r+1][c-1])){
moves.push({r:r+1,c:c-1});
}

if(inside(r+1,c+1) && isWhite(board[r+1][c+1])){
moves.push({r:r+1,c:c+1});
}

break;

case "♘":
case "♞":

[
[-2,-1],[-2,1],
[-1,-2],[-1,2],
[1,-2],[1,2],
[2,-1],[2,1]
].forEach(m=>addMove(r+m[0],c+m[1]));

break;

case "♔":
case "♚":

for(let dr=-1;dr<=1;dr++){

for(let dc=-1;dc<=1;dc++){

if(dr!==0 || dc!==0){
addMove(r+dr,c+dc);
}

}

}

break;
}
        case "♖":
case "♜":

[
[-1,0],
[1,0],
[0,-1],
[0,1]
].forEach(d=>{

let nr=r+d[0];
let nc=c+d[1];

while(inside(nr,nc)){

if(board[nr][nc]==null){

moves.push({r:nr,c:nc});

}else{

if(!sameTeam(piece,board[nr][nc])){
moves.push({r:nr,c:nc});
}

break;
}

nr+=d[0];
nc+=d[1];

}

});

break;

case "♗":
case "♝":

[
[-1,-1],
[-1,1],
[1,-1],
[1,1]
].forEach(d=>{

let nr=r+d[0];
let nc=c+d[1];

while(inside(nr,nc)){

if(board[nr][nc]==null){

moves.push({r:nr,c:nc);

}else{

if(!sameTeam(piece,board[nr][nc])){
moves.push({r:nr,c:nc});
}

break;
}

nr+=d[0];
nc+=d[1];

}

});

break;

case "♕":
case "♛":

[
[-1,0],
[1,0],
[0,-1],
[0,1],
[-1,-1],
[-1,1],
[1,-1],
[1,1]
].forEach(d=>{

let nr=r+d[0];
let nc=c+d[1];

while(inside(nr,nc)){

if(board[nr][nc]==null){

moves.push({r:nr,c:nc});

}else{

if(!sameTeam(piece,board[nr][nc])){
moves.push({r:nr,c:nc});
}

break;
}

nr+=d[0];
nc+=d[1];

}

});

break;

}

return moves;

    }
function renderBoard(){

boardElement.innerHTML="";

for(let r=0;r<8;r++){

for(let c=0;c<8;c++){

const square=document.createElement("div");

square.className="square "+(((r+c)%2===0)?"light":"dark");

if(selectedSquare &&
selectedSquare.r===r &&
selectedSquare.c===c){
square.classList.add("selected");
}

if(validMoves.some(m=>m.r===r && m.c===c)){
square.classList.add("valid-move");
}

square.textContent=board[r][c] || "";

square.onclick=()=>handleSquareClick(r,c);

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

turn=turn==="white"?"black":"white";
turnDisplay.textContent=
turn.charAt(0).toUpperCase()+turn.slice(1);

selectedSquare=null;
validMoves=[];

renderBoard();
return;

}

if(piece &&
((turn==="white" && isWhite(piece)) ||
(turn==="black" && isBlack(piece)))){

selectedSquare={r,c};
validMoves=getValidMoves(r,c);

renderBoard();
return;

}

selectedSquare=null;
validMoves=[];
renderBoard();
return;

}

if(piece &&
((turn==="white" && isWhite(piece)) ||
(turn==="black" && isBlack(piece)))){

selectedSquare={r,c};
validMoves=getValidMoves(r,c);

}

renderBoard();

}

renderBoard();
function findKing(color){

const king=color==="white"?"♔":"♚";

for(let r=0;r<8;r++){

for(let c=0;c<8;c++){

if(board[r][c]===king){
return {r,c};
}

}

}

return null;

}

function canAttack(piece,fr,fc,tr,tc){

const dr=tr-fr;
const dc=tc-fc;

switch(piece){

case "♙":
return dr===-1 && Math.abs(dc)===1;

case "♟":
return dr===1 && Math.abs(dc)===1;

case "♘":
case "♞":
return (Math.abs(dr)===2 && Math.abs(dc)===1) ||
(Math.abs(dr)===1 && Math.abs(dc)===2);

case "♔":
case "♚":
return Math.abs(dr)<=1 && Math.abs(dc)<=1;

case "♖":
case "♜":

if(dr!==0 && dc!==0) return false;
return clearPath(fr,fc,tr,tc);

case "♗":
case "♝":

if(Math.abs(dr)!==Math.abs(dc)) return false;
return clearPath(fr,fc,tr,tc);

case "♕":
case "♛":

if(dr===0 || dc===0 || Math.abs(dr)===Math.abs(dc)){
return clearPath(fr,fc,tr,tc);
}

return false;

}

return false;

 }
function isKingInCheck(color){

const king=findKing(color);

if(!king) return false;

for(let r=0;r<8;r++){

for(let c=0;c<8;c++){

const piece=board[r][c];

if(!piece) continue;

if(color==="white" && isBlack(piece)){

if(canAttack(piece,r,c,king.r,king.c)){
return true;
}

}

if(color==="black" && isWhite(piece)){

if(canAttack(piece,r,c,king.r,king.c)){
return true;
}

}

}

}

return false;

}

function wouldLeaveKingInCheck(fromR,fromC,toR,toC){

const movingPiece=board[fromR][fromC];
const capturedPiece=board[toR][toC];

board[toR][toC]=movingPiece;
board[fromR][fromC]=null;

const color=isWhite(movingPiece)?"white":"black";

const check=isKingInCheck(color);

board[fromR][fromC]=movingPiece;
board[toR][toC]=capturedPiece;

return check;

                               }
