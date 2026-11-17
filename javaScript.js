//Each cell knows its own value
function Cell(){
    let value = 0;

    const addToken = (playerToken) => {
        value = playerToken;
    };

    const getValue = () => value;

    return {addToken, getValue};
}

//Gameboard has no responsibility to know the value within each cell
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
        //Returns a 2D array with the cells values
        const boardWithCellValues = board.map((row) => //For each row-array, take cells values
                                               row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    const resetBoard = () => {
            for(let i = 0; i < rows; i++){
                for(let j = 0; j < columns; j++){
                    board[i][j].addToken(0); 
            }
        }
    };

    return {getBoard, setToken, printBoard, resetBoard};
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

    const checkWinner = (board) => {
        let tknCountA = 0;
        let tknCountB = 0;

        const tknAPos = [];
        const tknBPos = [];

        //All possible win triplets in matrix of 9 elements
        let combs = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
	    ];

        const boardWithCellValues = board.getBoard().map((row) => 
                                    row.map((cell) => cell.getValue()));

        //Count tokens amount for each player
        for(let i = 0; i < boardWithCellValues.length; i++){
            for(let j = 0; j < boardWithCellValues[i].length; j++){

                if(boardWithCellValues[i][j] === players[0].token){tknCountA++;}
                else if(boardWithCellValues[i][j] === players[1].token){tknCountB++;}

            }
        }

        //Works the same, less clear
        /*boardWithCellValues.forEach((row) => {row.map((cell) => {
                                                if(cell === players[0].token){tknCountA++;}
                                                else if(cell === players[1].token){tknCountB++;}
            })
        });*/

        console.log("Player A has placed: "+ tknCountA +" tokens");
        console.log("Player B has placed: "+ tknCountB +" tokens");

        if(tknCountA >= 3 || tknCountB >= 3){
            //take 2D array, turn into 1D array, loop over 1D array, get index of tokens,
            //push indexes into respective arrays (A or B), 
            //check against "combs" for victory.
            const flattenedCellValuesArray = [].concat.apply([], boardWithCellValues);
            for(let k = 0; k < flattenedCellValuesArray.length; k++){
                if(flattenedCellValuesArray[k] === players[0].token){tknAPos.push(k);}
                else if(flattenedCellValuesArray[k] === players[1].token){tknBPos.push(k);}
            }

            //Check presence of any combs sub-array inside Pos arrays.
            for(const comb of combs) {

                if(comb.every((position) => tknAPos.includes(position))){
                    //console.log(`${players[0].name} wins!`);
                    return players[0];
                }
                else if(comb.every((position) => tknBPos.includes(position))){
                    //console.log(`${players[1].name} wins!`);
                    return players[1];
                }
                
            }
            
        }

        if(tknCountA + tknCountB >= 8){
            return -2; // -2 = draw
        }

        return -1; // -1 = nothing happens, yet

    };

    const printWinner = (winner) => {
        if(winner === -2){
            console.log("DRAW! Nobody wins");
        } else if(winner !== -1 && winner !== -2){
            console.log(`${winner.name} wins!`);
            board.printBoard();

            console.log("A new game begins");
            board.resetBoard();
        }

        return;
    };

    const playRound = (row, column) => {

        console.log(
            `Setting ${getActivePlayer().name}'s token at coords row:${row}-column:${column}`);

        board.setToken(row, column, getActivePlayer().token);  

        /*Check for winner/handle logic*/
        printWinner(checkWinner(board));
        
        
        switchPlayerTurn();
        printNewRound();
    };

    //Initial state
    printNewRound();

    return{playRound, getActivePlayer};
    
}

const game = GameController();