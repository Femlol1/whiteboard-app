import { useEffect, useRef, useState } from 'react';
import openSocket from 'socket.io-client';
import Tools from './Tools';

const socket = openSocket("http://localhost:3000");
console.log(socket);

function Board() {
  const [selected, setSelected] = useState('Pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({x:0, y:0});
  const [data, setImageData] = useState();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.lineCap="round";
    context.strokeStyle="black";
    context.lineWidth = 5;
    contextRef.current = context;

    setImageData(canvas.toDataURL("image/png"));

    socket.on("canvas-update", function(data) {
      console.log("Update to canvas recieved")
      var image = new Image();
      var canvas = document.querySelector("#board");
      var ctx = canvas.getContext('2d');
      image.onload = function() {
        ctx.drawImage(image, 0, 0);
      }
      image.src = data;
    });

  }, [])
  
  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    if (!isDrawing) setStartPos({x: offsetX, y: offsetY});
    if (selected === "Pencil") { 
      contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
      renderBase();
      contextRef.current.beginPath(); 
    }
    setIsDrawing(true);
  }

  const stopDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.closePath();
    socket.emit("canvas-update", canvasRef.current.toDataURL("image/png"));
    setImageData(canvasRef.current.toDataURL("image/png"));
    setIsDrawing(false);
  }
  const draw = ({nativeEvent}) => {
    if (!isDrawing) return;
    const {offsetX, offsetY} = nativeEvent;
    if (selected === "Pencil") {
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    } else {
        contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        renderBase();
        contextRef.current.beginPath();
        contextRef.current.arc(startPos.x, startPos.y, (Math.sqrt(((startPos.x - offsetX)**2) + ((startPos.y - offsetY)**2))), 0, 2 * Math.PI, false);
        contextRef.current.stroke();
    }
    
  }
  
  const renderBase = () => {
    var image = new Image();
    image.onload = function() {
      contextRef.current.drawImage(image, 0, 0);
    }
    image.src = data;
  }

  return (
    <div className="w-screen h-screen">
      <Tools setSelected={setSelected} selected={selected} />
      <canvas 
        className="w-screen h-screen" id="board"
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
