/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const htmlBoard = document.querySelector('#board');
const button = document.querySelector('.button');

//button refreshes page so players can go again
button.addEventListener('click', () => {
	window.location.reload();
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
	board.length = WIDTH;
	for (let i = 0; i < HEIGHT; i++) {
		board[i] = new Array(WIDTH);
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
	//this section of the makeHtmlBoard function is creating the x-axis of the visual board
	//when clicked, there should be some player piece dropping into the board via the handleClick function callback
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);
	//this section of code is creating the y-axis (rows) of the visual board
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	//loops through the y index for the given x index; returns the y index if empty, returns null if all y indices for given x are full
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}
/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	let piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`p${currPlayer}`);
	let play = document.getElementById(`${y}-${x}`);
	play.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
	alert(`${msg}`);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;
	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}
	// place piece in board and add to HTML table
	board[y][x] = currPlayer;
	placeInTable(y, x);
	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}
	// check for tie
	if (
		board.every((y) => {
			return !y.includes(undefined);
		})
	) {
		return endGame('Tie!');
	}
	// }
	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}
	//starting from y=0, this loop checks each y space for pieces that match. Horiz checks for horizontal victory (4 pieces that match horizontally), vert checks vertically, diagDR checks down and to the right for a diagonal victory, and diagDL checks down and to the left. If any of the win variables return true, then it returns a win.
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
