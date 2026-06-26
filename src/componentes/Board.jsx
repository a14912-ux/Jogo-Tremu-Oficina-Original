function Board({ historico, tentativaAtual, totalLinhas, tamanho }) {
  return (
    <div className="board">
      {[...Array(totalLinhas)].map((_, row) => {
        // Linha já jogada
        if (row < historico.length) {
          const { letras, resultado } = historico[row];
          return (
            <div key={row} className="row">
              {[...Array(tamanho)].map((_, col) => (
                <div key={col} className={`cell ${resultado[col]}`}>
                  {letras[col]}
                </div>
              ))}
            </div>
          );
        }

        // Linha atual (a ser preenchida)
        if (row === historico.length) {
          return (
            <div key={row} className="row">
              {[...Array(tamanho)].map((_, col) => (
                <div key={col} className="cell">
                  {tentativaAtual[col] ?? ""}
                </div>
              ))}
            </div>
          );
        }

        // Linhas vazias futuras
        return (
          <div key={row} className="row">
            {[...Array(tamanho)].map((_, col) => (
              <div key={col} className="cell"></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Board;