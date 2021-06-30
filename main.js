const Gameboard = (
    function () {
        let board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        let get = () => board;

        let set = (row, col) => board[row][col] = FlowController.getPlayerIcon();

        let reset = () => board = [
                        ['', '', ''],
                        ['', '', ''],
                        ['', '', '']
                    ];
        
        let checkWin = () => {
            let emptyBoxCount = 0;
            let diagTopLeft = [];
            let diagTopRight = [];
            for (let i = 0; i < board.length; i++) {
                if (board[i][0] === board[i][1] && board[i][0] == board[i][2] && board[i][0] !== ''){ //horizontal win check
                    const winner = board[i][0] === 'O' ? 'p1' : 'p2';
                    console.log(`${winner} is the winner horizontally`);
                    return winner;
                }
                if (board[0][i] === board[1][i] && board[0][i] == board[2][i] && board[0][i] !== ''){ //vertical win check
                    const winner = board[0][i] === 'O' ? 'p1' : 'p2';
                    console.log(`${winner} is the winner vertically`);
                    return winner;
                }
                diagTopLeft.push(board[i][i]);
                diagTopRight.push(board[i][2-i]);
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === '') {
                        emptyBoxCount += 1;
                    }
                }
            }
            if ((diagTopLeft.every((val, i, arr) => val === arr[0])) && diagTopLeft[0] !== '') {
                const winner = diagTopLeft[0] === 'O' ? 'p1' : 'p2';
                console.log(`${winner} is the winner diagonally`);
                return winner;
            }
            if ((diagTopRight.every((val, i, arr) => val === arr[0])) && diagTopRight[0] !== '') {
                const winner = diagTopRight[0] === 'O' ? 'p1' : 'p2';
                console.log(`${winner} is the winner diagonally`);
                return winner;
            }
            if (emptyBoxCount === 0) {
                return 'draw';
            }
        }

        return {
            get,
            reset,
            set,
            checkWin
        };
    }
)();

const Player = (name) => ({
    name,
    win : 0,
    loss : 0,
    draw: 0
});

const DisplayController = (
    function () {

        const displayBoard = () => {
            const board = Gameboard.get();
            const boardDisplay = document.querySelector('#gameboard');
            boardDisplay.innerHTML = '';
            for (let row = 0; row < board.length; row++){
                for (let col = 0; col < board[row].length; col++){
                    let box = document.createElement('div');
                    box.classList.add('tictac-box');
                    

                    let content = document.createElement('div');
                    content.classList.add('tictac-box-content');
                    content.setAttribute('data-position', `${row}${col}`);
                    content.innerText = board[row][col];
                    box.appendChild(content);

                    boardDisplay.appendChild(box);
                }
            }
            FlowController.setEventListeners();
        };

        const displayScoreboard = () => {
            stats = FlowController.getStats();
            p1Scoreboard = document.querySelector('.p1');
            p1Scoreboard.innerHTML = `<input id='p1' class='text-center py-1 fs-5 m-3' type='text' value='Player 1'>
                                        <p>Win: ${stats.p1.win}</p>
                                        <p>Loss: ${stats.p1.loss}</p>
                                        <p>Draw: ${stats.p1.draw}</p>`;

            p2Scoreboard = document.querySelector('.p2');
            p2Scoreboard.innerHTML = `<input id='p2' class='text-center py-1 fs-5 m-3' type='text' value='Player 2'>
                                        <p>Win: ${stats.p2.win}</p>
                                        <p>Loss: ${stats.p2.loss}</p>
                                        <p>Draw: ${stats.p2.draw}</p>`;
        };

        return {
            displayBoard,
            displayScoreboard
        };
    }
)();

const FlowController = (
    function () {
        let players = {};
        let turn = 1;
        let gameover = false;

        let initGame = (board) => {
            players.p1 = Player('1');
            players.p2 = Player('2');

            DisplayController.displayBoard();

            document.querySelector('#new-game-btn').addEventListener('click', newGame);

            DisplayController.displayScoreboard();
            addNameChangeEvent();
        };

        let getPlayerIcon = () => {
            if (turn % 2 === 0){
                turn ++;
                return 'X';
            }
            else {
                turn ++;
                return 'O';
            }
        };

        let getStats = () => players;

        let newGame = () => {
            Gameboard.reset();
            DisplayController.displayBoard();
            document.querySelector('#new-game-container').classList.add('invisible');
            turn = 1;
        }

        let updateScore = (result) => {
            if (result === 'p1') {
                players.p1.win += 1;
                players.p2.loss += 1;
                console.log('p1 win');
            }
            else if (result === 'p2'){
                players.p2.win += 1;
                players.p1.loss += 1;
                console.log('p2 win');
            }
            else if (result === 'draw') {
                players.p2.draw += 1;
                players.p1.draw += 1;
                console.log('draw');
            }
            DisplayController.displayScoreboard();
            removeEventListeners(); //prevent extra clicks winning more points for one player
            document.querySelector('#new-game-container').classList.remove('invisible');
        }

        let setEventListeners = () => {
            const contents = document.querySelectorAll('.tictac-box-content');

            for (let i = 0; i < contents.length; i++) {
                contents[i].addEventListener('click', boxClickHandler)
            }
        }

        boxClickHandler = (e) => {
            if (e.target.innerText === ''){
                let [row, col] = e.target.getAttribute('data-position').split('');
                Gameboard.set(parseInt(row), parseInt(col));
                DisplayController.displayBoard();
                if (Gameboard.checkWin()) {
                    updateScore(Gameboard.checkWin());
                }
            }
        };

        let removeEventListeners = () => {
            const contents = document.querySelectorAll('.tictac-box-content');

            for (let i = 0; i < contents.length; i++) {
                contents[i].removeEventListener('click', boxClickHandler);
            }
        };

        let addNameChangeEvent = () => {
            document.querySelector('#p1').addEventListener('change', (e) => {
                players.p1.name = e.target.value;
            })
            document.querySelector('#p2').addEventListener('change', (e) => {
                players.p1.name = e.target.value;
            })
        }

        return {
            initGame,
            getPlayerIcon,
            setEventListeners,
            getStats
        };
    }
)();

FlowController.initGame();