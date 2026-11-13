//Each cell knows its own value
function Cell(){
    let value = 0;

    const addToken = (playerToken) => {
        value = playerToken;
    };

    const getValue = () => value;

    return {addToken, getValue};
}

//Gameboard has no responsibility to know the value in each cell
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = []; //Create as many empty arrays as there are rows (one per iteration)
        for(let j = 0; j < columns; j++){
            board[i].push(Cell()); //Fill each row-array with as many cells as there are columns
        }
    }

    const getBoard = () => board;

    const setToken  = (row, column, playerToken) => {

        if((row >= 0 && row < 3) && (column >= 0 && column < 3)){
            //Verify presence/absence of player token
            if(board[row][column].getValue() === 0) {
               board[row][column].addToken(playerToken); //Set player token (change cell value)
            } else {
                console.log("Cell is taken already! Choose a different one.");
                return;
            }        
        } else {
            console.log("Invalid cell! Out of grid bounds.");
            return;
        }

    };

    const printBoard = () => {
        //Returns an array with the cells values
        const boardWithCellValues = board.map((row) => //For each row-array, take cells values
                                               row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return {getBoard, setToken, printBoard};
}

function GameController(playerA = "player A", playerB = "player B"){
    const board = Gameboard();

    const players = [
        {
            name: playerA,
            token: "X",
        }, 
        {
            name: playerB,
            token: "O",
        },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(
            `Setting ${getActivePlayer().name}'s token at coords row:${row}-column:${column}`);

        board.setToken(row, column, getActivePlayer().token);  

        /*Check for winner/handle logic*/
        
        switchPlayerTurn();
        printNewRound();
    };

    //Initial state
    printNewRound();

    return{playRound, getActivePlayer};
    
}

const game = GameController();