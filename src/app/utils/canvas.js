'use client'
import React, { useRef, useState, useEffect } from 'react';
import Slider from '../components/Slider';

const Canvas = ({ maskImage, onClose, onMaskComplete }) => {
  const backgroundCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const ctx = backgroundCanvas.getContext('2d');
    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      // Calculate aspect ratio and size
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = backgroundCanvas.width / backgroundCanvas.height;
      
      let drawWidth, drawHeight;
      if (imgAspectRatio > canvasAspectRatio) {
        drawWidth = backgroundCanvas.width;
        drawHeight = backgroundCanvas.width / imgAspectRatio;
      } else {
        drawWidth = backgroundCanvas.height * imgAspectRatio;
        drawHeight = backgroundCanvas.height;
      }

      // Center the image on the canvas
      const xOffset = (backgroundCanvas.width - drawWidth) / 2;
      const yOffset = (backgroundCanvas.height - drawHeight) / 2;

      ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
    };
  }, [maskImage]);

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const drawingCanvas = drawingCanvasRef.current;
    const ctx = drawingCanvas.getContext('2d');
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isErasing) {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handleClose = () => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = backgroundCanvas.width;
    offScreenCanvas.height = backgroundCanvas.height;
    const offScreenCtx = offScreenCanvas.getContext('2d');

    offScreenCtx.drawImage(backgroundCanvas, 0, 0);

    offScreenCtx.drawImage(drawingCanvas, 0, 0);

    const maskedImage = offScreenCanvas.toDataURL();
    onMaskComplete(maskedImage);
    onClose();
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <div className="flex justify-between mb-2">
          <button onClick={handleClose} className="px-4 py-2 bg-red-500 text-white rounded">
            Close
          </button>
          <button onClick={toggleEraser} className={`px-4 py-2 ${isErasing ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded`}>
            {isErasing ? 'Eraser' : 'Brush'}
          </button>
        </div>
        <div className="mb-2">
          <div className="w-52">
            <Slider
              label="Brush Size"
              value={brushSize}
              min={10}
              max={100}
              initialValue={10}
              onChange={(value) => setBrushSize(value)}
            />
          </div>
        </div>
        <div className="relative">
          <canvas
            ref={backgroundCanvasRef}
            width={1000}
            height={500}
            className="absolute top-0 left-0 border border-black"
          />
          <canvas
            ref={drawingCanvasRef}
            width={1000}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="relative border border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
