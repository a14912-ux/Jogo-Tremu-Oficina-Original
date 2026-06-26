import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

function GestureInput({ adicionarLetra }) {
  const webcamRef = useRef(null);
  const [letra, setLetra] = useState("");
  const letraRef = useRef("");  // ref para evitar dependência no useEffect

  function reconhecerLetra(pontos) {
    const dedos = {
      indicador: pontos[8].y < pontos[6].y,
      medio:     pontos[12].y < pontos[10].y,
      anelar:    pontos[16].y < pontos[14].y,
      mindinho:  pontos[20].y < pontos[18].y,
    };

    // Gesto A (mão fechada)
    if (!dedos.indicador && !dedos.medio && !dedos.anelar && !dedos.mindinho) {
      return "A";
    }

    // Gesto B (quatro dedos levantados)
    if (dedos.indicador && dedos.medio && dedos.anelar && dedos.mindinho) {
      return "B";
    }

    return "";
  }

  function reconhecerLetra(p) {
  // Auxiliares
  const dedo = (ponta, no) => p[ponta].y < p[no].y;
  const polegar = p[4].x < p[3].x; // mão direita: polegar esticado vai para a esquerda

  const I = dedo(8, 6);   // indicador
  const M = dedo(12, 10); // médio
  const A = dedo(16, 14); // anelar
  const Mi = dedo(20, 18); // mindinho
  const P = polegar;

  // --- Letras estáticas LGP ---

  // A - mão fechada, polegar ao lado
  if (!I && !M && !A && !Mi && !P) return "A";

  // B - quatro dedos esticados juntos, polegar dobrado
  if (I && M && A && Mi && !P) return "B";

  // C - mão em forma de C (todos semi-dobrados — aproximação: apenas indicador e mindinho levantados)
  if (I && !M && !A && Mi && !P) return "C";

  // D - indicador levantado, médio toca polegar
  if (I && !M && !A && !Mi && P) return "D";

  // E - todos os dedos dobrados, polegar por baixo
  if (!I && !M && !A && !Mi && P) return "E";

  // F - indicador e polegar fazem círculo, outros esticados
  if (!I && M && A && Mi && P) return "F";

  // G - indicador apontado para o lado, polegar paralelo
  if (I && !M && !A && !Mi && !P) return "G";

  // H - indicador e médio esticados horizontalmente
  if (I && M && !A && !Mi && !P) return "H";

  // I - mindinho esticado, outros fechados
  if (!I && !M && !A && Mi && P) return "I";

  // J - como I mas com movimento (estático: igual a I, usar como fallback)
  // (J é dinâmico na LGP — difícil sem movimento)

  // K - indicador e médio esticados, polegar entre eles
  if (I && M && !A && !Mi && P) return "K"; // conflito com H, refinar se necessário

  // L - indicador e polegar esticados em L
  if (I && !M && !A && !Mi && P) return "L"; // conflito com D, refinável pela posição do polegar

  // M - três dedos dobrados sobre o polegar
  if (!I && !M && !A && !Mi && !P) return "M"; // igual a A por posição — refinar

  // N - dois dedos sobre o polegar
  // (refinamento futuro)

  // O - todos os dedos formam círculo com o polegar
  if (!I && !M && !A && !Mi && P) return "O"; // igual a E — refinável pela curvatura

  // P - como K mas inclinado para baixo
  // (dinâmico ou por inclinação)

  // Q - indicador e polegar apontados para baixo
  // (refinável pela posição y do pulso vs pontas)

  // R - indicador e médio cruzados
  if (I && M && !A && !Mi && !P) return "R"; // igual a H — cruzamento difícil de detectar sem ângulos

  // S - punho fechado, polegar sobre os dedos
  if (!I && !M && !A && !Mi && !P) return "S"; // igual a A

  // T - polegar entre indicador e médio
  // (refinável pela posição)

  // U - indicador e médio unidos e levantados
  if (I && M && !A && !Mi && !P) return "U"; // igual a H

  // V - indicador e médio esticados em V (afastados)
  if (I && M && !A && !Mi && !P) return "V"; // igual a H — afastamento difícil

  // W - três dedos esticados
  if (I && M && A && !Mi && !P) return "W";

  // X - indicador dobrado em gancho
  // (difícil com só y)

  // Y - polegar e mindinho esticados
  if (!I && !M && !A && Mi && P) return "Y"; // igual a I

  // Z - dinâmico (traça Z no ar)

  return "";
}

  useEffect(() => {
    const handsScript = document.createElement("script");
    handsScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

    const cameraScript = document.createElement("script");
    cameraScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

    handsScript.onload = () => {
      cameraScript.onload = () => {
        const hands = new window.Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults((resultado) => {
          if (
            resultado.multiHandLandmarks &&
            resultado.multiHandLandmarks.length > 0
          ) {
            const pontos = resultado.multiHandLandmarks[0];
            const novaLetra = reconhecerLetra(pontos);

            // Usa a ref em vez do state para comparar — sem dependência no useEffect
            if (novaLetra && novaLetra !== letraRef.current) {
              letraRef.current = novaLetra;
              setLetra(novaLetra);

              if (adicionarLetra) {
                adicionarLetra(novaLetra);
              }
            }
          }
        });

        const camera = new window.Camera(webcamRef.current.video, {
          onFrame: async () => {
            await hands.send({ image: webcamRef.current.video });
          },
          width: 400,
          height: 400,
        });

        camera.start();
      };

      document.body.appendChild(cameraScript);
    };

    document.body.appendChild(handsScript);
  }, [adicionarLetra]); // ← letra removida das dependências

  return (
    <div>
      <h2>Faz o gesto</h2>
      <Webcam ref={webcamRef} width={400} height={400} />
      <h3>Letra reconhecida: {letra}</h3>
    </div>
  );
}

export default GestureInput;