import Webcam from "react-webcam";

function Camera() {
  return (
    <div>
      <h2>Câmara - Faz o gesto da letra</h2>

      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        width={400}
      />

    </div>
  );
}

export default Camera;