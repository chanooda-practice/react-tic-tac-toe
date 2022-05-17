import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => {
//           this.props.onClick();
//         }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  let a,
    b,
    c = null;
  if (props.winnerArray) {
    [a, b, c] = props.winnerArray;
    console.log(a, b, c);
  }
  return (
    <button
      className={"square " + (props.seat === a || props.seat === b || props.seat === c ? "winner" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        seat={i}
        onClick={() => this.props.onClick(i)}
        winnerArray={this.props.winnerArray}
      />
    );
  }
  render() {
    const writeBoard = [0, 1, 2].map((num, i) => (
      <div className="board-row" key={i}>
        {[i * 3, i * 3 + 1, i * 3 + 2].map((i) => this.renderSquare(i))}
      </div>
    ));
    return <div>{writeBoard}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      toggleSort: true,
      winner: null,
      winnerArray: null,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const checkWin = calculateWinner(current.squares);
    let status;
    let winnerArray;

    const moves = history.map((step, move) => {
      const num = this.state.toggleSort ? move : history.length - 1 - move;
      const desc = num ? "Go to move #" + num : "Go to game start";
      return (
        <li key={num}>
          <button className={this.state.stepNumber === num ? "choose" : ""} onClick={() => this.jumpTo(num)}>
            {desc}
          </button>
          <Board squares={history[num].squares} />
        </li>
      );
    });

    if (checkWin) {
      const winner = checkWin.winner;
      winnerArray = checkWin.winnerArray;
      status = "Winner: " + winner;
    } else if (current.squares.indexOf(null) === -1 && !checkWin) {
      status = "DRAW";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-info">{status}</div>
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winnerArray={winnerArray} />
          <div className="game-record">
            <button className="sort-button" onClick={() => this.setState({ toggleSort: !this.state.toggleSort })}>
              {this.state.toggleSort ? "desc" : "asc"}
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(squares[a], lines[i]);
      return { winner: squares[a], winnerArray: lines[i] };
    }
  }
  return null;
}
