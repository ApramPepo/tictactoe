const gameboard = (() => {
    let cells = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => cells;
    const setMark = (index, mark) => {
        if (cells[index] === '' && index >= 0 && index < 9) {
            cells[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        cells = ['', '', '', '', '', '', '', '', ''];
    };

    const getCells = () => cells.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    return { getBoard, setMark, resetBoard, getCells };
})();

const player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {
        getName, getMark
    };
}

const controller = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = false;

    const winCondition = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const startGame = () => {
        const player1 = document.getElementById('player1').value || 'Player 1';
        const player2 = document.getElementById('player2').value || 'Player 2';
        players = [player(player1, 'X'), player(player2, 'O')];
        gameActive = true;
        currentPlayerIndex = 0;
        gameboard.resetBoard();
        updateDisplay();
        updateGameStatus(`${players[currentPlayerIndex].getName()}'s turn`);
    };

    const cellClick = (e) => {
        if (!gameActive) return;
        const index = e.target.dataset.index;
        if (gameboard.setMark(index, players[currentPlayerIndex].getMark())) {
            updateDisplay();
            if (checkWin()) {
                updateGameStatus(`${players[currentPlayerIndex].getName()} Wins!`);
                gameActive = false;
            } else if (gameboard.getCells().length === 0) {
                updateGameStatus("It's a tie!");
                gameActive = false;
            } else {
                currentPlayerIndex = (currentPlayerIndex + 1) % 2;
                updateGameStatus(`${players[currentPlayerIndex].getName()}'s turn`);
            }
        }
    };

    const checkWin = () => {
        const board = gameboard.getBoard();
        return winCondition.some(combo => combo.every(index => board[index] === players[currentPlayerIndex].getMark()));
    };

    const updateDisplay = () => {
        const cells = document.querySelectorAll('.cell');
        gameboard.getBoard().forEach((mark, index) => {
            cells[index].textContent = mark;
        });
    };

    const updateGameStatus = (message) => {
        document.getElementById('status').textContent = message;
    };

    const init = () => {
        document.getElementById('start').addEventListener('click', startGame);
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', cellClick));
        document.getElementById('restart').addEventListener('click', reset);
    };

    const reset = () => {
        gameboard.resetBoard();
        gameActive = false;
        currentPlayerIndex = 0;
        updateDisplay();
        updateGameStatus('');
    }

    return { init };
})();

controller.init();