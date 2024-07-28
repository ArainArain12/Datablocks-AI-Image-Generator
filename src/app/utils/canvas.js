'use client'
import React, { useRef, useState, useEffect } from 'react';

const Canvas = ({ maskImage, onClose,onMaskComplete  }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 12.5, 0, 2 * Math.PI); // Draw circle with radius 12.5 (equivalent to diameter 25)
    ctx.fill();
  };

  const handleClose = () => {
    const canvas = canvasRef.current;
    const maskedImage = canvas.toDataURL();
    onMaskComplete(maskedImage); // Send the masked image data back
    onClose();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <button onClick={handleClose} className="mb-2 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
        <canvas
          ref={canvasRef}
          width={1000} 
          height={500} 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="border border-black"
        />
      </div>
    </div>
  );
};

export default Canvas;
