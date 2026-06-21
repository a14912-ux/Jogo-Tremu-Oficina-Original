function Board() {
  return (
    <div className="board">
      {[...Array(6)].map((_, row) => (
        <div key={row} className="row">
          {[...Array(4)].map((_, col) => (
            <div key={col} className="cell"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;