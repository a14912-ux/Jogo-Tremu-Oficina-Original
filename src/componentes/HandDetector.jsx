import { useEffect, useRef } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs";

import Webcam from "react-webcam";


function HandDetector() {

  const webcamRef = useRef(null);


  useEffect(() => {

    const run = async () => {

      const detector = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        {
          runtime: "tfjs",
          modelType: "lite"
        }
      );


      setInterval(async () => {

        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4
        ) {

          const hands = await detector.estimateHands(
            webcamRef.current.video
          );


          console.log("Mãos encontradas:", hands.length);

        }

      }, 500);

    };


    run();

  }, []);



  return (

    <div>

      <h2>Reconhecimento de mão</h2>

      <Webcam
        ref={webcamRef}
        width={400}
        height={300}
      />

    </div>

  );

}


export default HandDetector;