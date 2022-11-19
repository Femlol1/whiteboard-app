import { useEffect, useRef, useState } from "react";
import openSocket from "socket.io-client";
import Tools from "./Tools";

/*
  TODO:

  - Reactive size of canvas to window size change
*/

// Setup a socket to express/socketio backend
const socket = openSocket("http://localhost:3000");

function Board() {
  const [selected, setSelected] = useState("Pencil");             // Selected tool state
  const [isDrawing, setIsDrawing] = useState(false);              // Boolean holding state of if drawing
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });       // Hold starting position of drawing
  const [data, setImageData] = useState();                        // Hold current base image data
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    // Setting size of canvas
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Get canvas html element and set the line style
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;

    // Store the base image data
    setImageData(canvas.toDataURL("image/png"));

    // Setup socket listening
    socket.on("canvas-update", function (data) {
      // Called when recieved new canvas data from express/socketio
      console.log("Update to canvas recieved");
      // Create an image object and set image source to data recieved from backend
      var image = new Image();
      var canvas = document.querySelector("#board");
      var ctx = canvas.getContext("2d");
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = data;
    });
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    // Get the mouse coordinates from nativeEvent (in this case on mouse press)
    const { offsetX, offsetY } = nativeEvent;
    // Set the start position in the state
    if (!isDrawing) setStartPos({ x: offsetX, y: offsetY });
    if (selected === "Pencil") {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      renderBase();
      contextRef.current.beginPath();
    }
    setIsDrawing(true);
  };

  const stopDrawing = ({ nativeEvent }) => {
    // Get the mouse coordinates from nativeEvent (in this case on mouse unpress)
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.closePath();
    socket.emit("canvas-update", canvasRef.current.toDataURL("image/png"));
    setImageData(canvasRef.current.toDataURL("image/png"));
    setIsDrawing(false);
  };
  
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    // Get the mouse coordinates from nativeEvent (in this case on mouse movement)
    const { offsetX, offsetY } = nativeEvent;
    if (selected === "Pencil") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      renderBase();
      contextRef.current.beginPath();
      contextRef.current.arc(
        startPos.x,
        startPos.y,
        Math.sqrt((startPos.x - offsetX) ** 2 + (startPos.y - offsetY) ** 2),
        0,
        2 * Math.PI,
        false
      );
      contextRef.current.stroke();
    }
  };

  // Helper function to create an image from image date store and draw image to canvas
  const renderBase = () => {
    var image = new Image();
    image.onload = function () {
      contextRef.current.drawImage(image, 0, 0);
    };
    image.src = data;
  };

  return (
    <div className="w-screen h-screen">
      <Tools setSelected={setSelected} selected={selected} />
      <canvas
        className="w-screen h-screen"
        id="board"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        ref={canvasRef}
      />
    </div>
  );
}

export default Board;
