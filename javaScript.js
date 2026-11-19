/*#######################################################################*/
//Each cell knows its own value
function Cell(){
    let value = 0;

    const addToken = (playerToken) => {
        value = playerToken;
    };

    const getValue = () => value;

    return {addToken, getValue};
}
/*#######################################################################*/
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

/*#######################################################################*/
function GameController(playerA = "Player A", playerB = "Player B"){
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
    let gameOver = false;
    let gameResult = -1;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const getBoardWithCellValues = (board) =>{
        return board.getBoard().map((row) => 
                                     row.map((cell) => cell.getValue()));
    };

    const countTokens = (board) => {
        let tknCountA = 0;
        let tknCountB = 0;

        const boardWithCellValues = getBoardWithCellValues(board);

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

        return [tknCountA, tknCountB];

    };

    const checkWinner = (board) => {


        let tknCount = [];
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

        tknCount = countTokens(board);

        if(tknCount[0] >= 3 || tknCount[1] >= 3){
            //take 2D array, turn into 1D array, loop over 1D array, get index of tokens,
            //push indexes into respective arrays (A or B), 
            //check against "combs" for victory.
            const flattenedCellValuesArray = [].concat.apply([], getBoardWithCellValues(board));
            for(let k = 0; k < flattenedCellValuesArray.length; k++){
                if(flattenedCellValuesArray[k] === players[0].token){tknAPos.push(k);}
                else if(flattenedCellValuesArray[k] === players[1].token){tknBPos.push(k);}
            }

            //Check presence of any combs sub-array inside Pos arrays.
            for(const comb of combs) {

                if(comb.every((position) => tknAPos.includes(position))){
                    gameOver = true;
                    gameResult = players[0]
                    return gameResult;
                }
                else if(comb.every((position) => tknBPos.includes(position))){
                    gameOver = true;
                    gameResult = players[1];
                    return gameResult;
                }
                
            }

            if(tknCount[0] + tknCount[1] === 9){
                gameOver = true;
                gameResult = -2
                return gameResult; 

            }
            
        }        

        return -1; // -1 = nothing happens, yet

    };

    
    const launchNewGame = () => {
        gameOver = false;
        gameResult = -1;
        board.printBoard();        
        board.resetBoard();
    };

    const playRound = (row, column) => {

        if(gameOver){return gameResult;}

        let winner = "";

        board.setToken(row, column, getActivePlayer().token);  
        
        switchPlayerTurn();
        printNewRound();

        return checkWinner(board);
    };

    //Initial state
    printNewRound();

    return{playRound, getActivePlayer, getBoard: board.getBoard, launchNewGame};
    
}
/*#######################################################################*/
function DisplayHandler(){
    const game = GameController();
    
    const newGameButton = document.querySelector(".new_game");
    const boardContainer = document.querySelector(".game_board");
    const turnDiv = document.querySelector(".player_turn");

    let roundResult = "";

    const updateScreen = (roundResult) => {
        boardContainer.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if(roundResult === -2){
            turnDiv.textContent = "DRAW! Nobody wins...";
        } else if(roundResult !== -1 && //No winner, yet
                  roundResult !== -2 && //DRAW
                  roundResult !== undefined){
            turnDiv.textContent = `${roundResult.name} (token: "${roundResult.token}") wins!`;
        } else {
            turnDiv.textContent = `${activePlayer.name}'s turn...`;
        }        

        board.forEach((row, row_index) =>{
            row.forEach((cell, col_index) => {
                const cellButton = document.createElement("button");
                cellButton.setAttribute("class","cell");

                cellButton.dataset.row = row_index;
                cellButton.dataset.column = col_index;
                cellButton.textContent = cell.getValue();

                if(roundResult !== -1 && roundResult !== undefined){
                    if(cell.getValue() === 0){
                        cellButton.disabled = true;
                    }
                }

                boardContainer.appendChild(cellButton);
            });
        });
    };

    

    function eventListenerBoard(event){
        row_index = event.target.dataset.row;
        col_index = event.target.dataset.column;        

        //Check valid cell choice
        if(!col_index || !row_index){return;}

        roundResult = game.playRound(row_index, col_index);
        updateScreen(roundResult);
                
    };

    function eventListenerNewGame(event){
        roundResult = "";
        game.launchNewGame();
        updateScreen();
    };

    boardContainer.addEventListener("click", eventListenerBoard);
    newGameButton.addEventListener("click", eventListenerNewGame);

    updateScreen();

    return{updateScreen};
}
/*#######################################################################*/

DisplayHandler();