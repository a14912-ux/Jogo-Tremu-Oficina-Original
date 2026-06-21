import { useState } from "react";

import "./App.css";

import Board from "./componentes/Board";
import GestureInput from "./componentes/GestureInput";
import KeyboardLGP from "./componentes/KeyboardLGP";


function App() {

  const palavraCerta = "PATO";

  const [letras, setLetras] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [mensagem, setMensagem] = useState("");


  function adicionarLetra(letra) {

    setLetras((anterior) => {

      if (anterior.length >= 4) {
        return anterior;
      }

      return [...anterior, letra];

    });

  }


  function verificarPalavra() {

    const tentativa = letras.join("");

    let novaResultado = [];

    for (let i = 0; i < palavraCerta.length; i++) {

      if (tentativa[i] === palavraCerta[i]) {

        novaResultado.push("certa");

      } else if (palavraCerta.includes(tentativa[i])) {

        novaResultado.push("posicao");

      } else {

        novaResultado.push("errada");

      }

    }


    setResultado(novaResultado);


    if (tentativa === palavraCerta) {

      setMensagem("Está certo!");

    } else {

      setMensagem("Está errado!");

    }

  }


  return (
    <div>

      <h1>TREMU NA OFICINA</h1>


      <Board 
        letras={letras}
        resultado={resultado}
      />


      <GestureInput
        adicionarLetra={adicionarLetra}
      />


      <KeyboardLGP />


      <button onClick={verificarPalavra}>
        Verificar
      </button>


      <p>
        {mensagem}
      </p>


    </div>
  );
}


export default App;