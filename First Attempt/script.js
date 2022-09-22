"use strict";

////////////Player Factory////////////
const player = (name, symbol) => {
  const playTurn = (board, cell) => {
    const indx = board.cells.findIndex((position) => position === cell);
    if (board.boardArray[indx] === "") {
      board.render();
      return indx;
    }
  };
  return { name, symbol, playTurn };
};

// const playerX = player("Player X", "X");
// const playerO = player("Player O", "O");

///////////////Game Logic////////////////

const createGameBoard = (() => {
  let boardArray = ["", "", "", "", "", "", "", "", ""];
  const gameBoard = document.querySelector("#board");
  const cells = Array.from(document.querySelectorAll(".cell"));
  let winner = null;

  const render = () => {
    boardArray.forEach((symbol, indx) => {
      cells[indx].textContent = boardArray[indx];
    });
  };

  const reset = () => {
    boardArray = ["", "", "", "", "", "", "", "", ""];
  };

  // different winning combos
  const checkWin = () => {
    const winArrays = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // checks if symbols in winning positions are the same, if not, tie.
    winArrays.forEach((combo) => {
      if (
        boardArray[combo[0]] &&
        boardArray[combo[0]] === boardArray[combo[1]] &&
        boardArray[combo[0]] === boardArray[combo[2]]
      ) {
        winner = "current";
      }
    });

    return winner || (boardArray.includes("") ? null : "Tie");
  };

  return {
    gameBoard,
    render,
    reset,
    checkWin,
    cells,
  };
})();

///////////////////////////Game Play ///////////////////////////////////

const gamePlay = (() => {
  const playerOneName = document.querySelector("#player1");
  const playerTwoName = document.querySelector("#player2");
  const form = document.querySelector(".player-info");
  const resetBtn = document.querySelector("#reset");
  let currPlayer;
  let playerOne;
  let playerTwo;

  const switchTurn = () => {
    currPlayer = currPlayer === playerOne ? playerTwo : playerOne;
  };

  const gameRound = () => {
    const board = createGameBoard;
    const gameStatus = document.querySelector(".game-status");
    if (currPlayer.name !== "") {
      gameStatus.textContent = `${currPlayer.name}'s Turn`;
    } else {
      gameStatus.textContent = "Board";
    }

    board.gameBoard.addEventListener("click", (e) => {
      e.preventDefault();
      const play = currPlayer.playTurn(board, e.target);
      if (play !== null) {
        board.boardArray[play] = `${currPlayer.symbol}`;
        board.render();
        const winStatus = board.checkWin();
        if (winStatus === "Tie") {
          gameStatus.textContent = "Tie!";
        } else if (winStatus === null) {
          switchTurn();
          gameStatus.textContent = `${currPlayer.name}'s Turn`;
        } else {
          gameStatus.textContent = `Winner is ${currPlayer.name}`;
          board.reset();
          board.render();
        }
      }
    });
  };

  const gameInit = () => {
    if (playerOneName.value !== "" && playerTwoName.value !== "") {
      playerOne = player(playerOneName.value, "X");
      playerTwo = player(playerTwoName.value, "O");
      currPlayer = playerOne;
      gameRound();
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (playerOneName.value !== "" && playerTwoName.value !== "") {
      gameInit();
      form.classList.add("hidden");
      document.querySelector(".place").classList.remove("hidden");
    } else {
      window.location.reload();
    }
  });

  resetBtn.addEventListener("click", () => {
    document.querySelector(".game-status").textContent = "Board: ";
    document.querySelector("#player1").value = "";
    document.querySelector("#player2").value = "";
    window.location.reload();
  });
  return {
    gameInit,
  };
})();

gamePlay.gameInit();
