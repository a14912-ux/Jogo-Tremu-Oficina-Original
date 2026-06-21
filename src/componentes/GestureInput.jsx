import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";


function GestureInput({ adicionarLetra }) {


  const webcamRef = useRef(null);

  const [letra, setLetra] = useState("");



  function reconhecerLetra(pontos) {


    const indicador = pontos[8];
    const medio = pontos[12];
    const anelar = pontos[16];
    const mindinho = pontos[20];



    const dedos = {


      indicador:
        indicador.y < pontos[6].y,


      medio:
        medio.y < pontos[10].y,


      anelar:
        anelar.y < pontos[14].y,


      mindinho:
        mindinho.y < pontos[18].y


    };



    // Gesto A (mão fechada)

    if (
      !dedos.indicador &&
      !dedos.medio &&
      !dedos.anelar &&
      !dedos.mindinho
    ) {

      return "A";

    }



    // Gesto B (quatro dedos levantados)

    if (
      dedos.indicador &&
      dedos.medio &&
      dedos.anelar &&
      dedos.mindinho
    ) {

      return "B";

    }



    return "";

  }





  useEffect(() => {


    const handsScript = document.createElement("script");

    handsScript.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";



    const cameraScript = document.createElement("script");

    cameraScript.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";





    handsScript.onload = () => {


      cameraScript.onload = () => {



        const hands = new window.Hands({


          locateFile: (file) =>

            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`


        });





        hands.setOptions({


          maxNumHands: 1,

          modelComplexity: 1,

          minDetectionConfidence: 0.7,

          minTrackingConfidence: 0.7


        });





        hands.onResults((resultado)=>{


          if (
            resultado.multiHandLandmarks &&
            resultado.multiHandLandmarks.length > 0
          ) {



            const pontos =
              resultado.multiHandLandmarks[0];



            const novaLetra =
              reconhecerLetra(pontos);




            if(novaLetra && novaLetra !== letra){



              setLetra(novaLetra);



              if(adicionarLetra){

                adicionarLetra(novaLetra);

              }


            }



          }



        });







        const camera = new window.Camera(



          webcamRef.current.video,



          {


            onFrame: async()=>{


              await hands.send({


                image:
                  webcamRef.current.video


              });


            },


            width:400,

            height:400


          }


        );




        camera.start();




      };



      document.body.appendChild(cameraScript);



    };





    document.body.appendChild(handsScript);




  }, [adicionarLetra, letra]);







  return (

    <div>


      <h2>Faz o gesto</h2>


      <Webcam

        ref={webcamRef}

        width={400}

        height={400}

      />



      <h3>
        Letra reconhecida: {letra}
      </h3>


    </div>

  );



}



export default GestureInput;