import { useState } from "react";
import "./App.css";
import Board from "./componentes/Board";
import GestureInput from "./componentes/GestureInput";
import KeyboardLGP from "./componentes/KeyboardLGP";

function App() {
  const palavraCerta = "PATO";

  const [tentativaAtual, setTentativaAtual] = useState([]);
  const [historico, setHistorico] = useState([]); // [{letras: [...], resultado: [...]}]
  const [mensagem, setMensagem] = useState("");
  const [jogoTerminado, setJogoTerminado] = useState(false);

  function adicionarLetra(letra) {
    if (jogoTerminado) return;

    setTentativaAtual((anterior) => {
      if (anterior.length >= palavraCerta.length) return anterior;
      return [...anterior, letra];
    });
  }

  function apagarLetra() {
    if (jogoTerminado) return;
    setTentativaAtual((anterior) => anterior.slice(0, -1));
  }

  function verificarPalavra() {
    if (jogoTerminado) return;
    if (tentativaAtual.length < palavraCerta.length) {
      setMensagem("Completa a palavra primeiro!");
      return;
    }

    const tentativa = tentativaAtual.join("");
    let novoResultado = [];

    for (let i = 0; i < palavraCerta.length; i++) {
      if (tentativa[i] === palavraCerta[i]) {
        novoResultado.push("certa");
      } else if (palavraCerta.includes(tentativa[i])) {
        novoResultado.push("posicao");
      } else {
        novoResultado.push("errada");
      }
    }

    const novaTentativa = { letras: tentativaAtual, resultado: novoResultado };
    setHistorico((anterior) => [...anterior, novaTentativa]);
    setTentativaAtual([]);

    if (tentativa === palavraCerta) {
      setMensagem("🎉 Está certo!");
      setJogoTerminado(true);
    } else if (historico.length + 1 >= 6) {
      setMensagem(`Fim do jogo! A palavra era: ${palavraCerta}`);
      setJogoTerminado(true);
    } else {
      setMensagem("Tenta outra vez!");
    }
  }

  return (
    <div>
      <h1>TREMU NA OFICINA</h1>

      <Board
        historico={historico}
        tentativaAtual={tentativaAtual}
        totalLinhas={6}
        tamanho={palavraCerta.length}
      />

      <GestureInput adicionarLetra={adicionarLetra} />

      <KeyboardLGP />

      <button onClick={apagarLetra}>⌫ Apagar</button>
      <button onClick={verificarPalavra}>Verificar</button>

      <p>{mensagem}</p>
    </div>
  );
}

export default App;