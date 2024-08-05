'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import "../style.css";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import Canvas from '../utils/canvas'; 

export default function Layout({ children }) {
  const [outputImageUrl, setOutputImageUrl] = useState("");
  const [text, setGenerateText] = useState(null);
  const [baseImage, setBaseImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [maskedImageData, setMaskedImageData] = useState(null);

  useEffect(() => {
    if (maskImage) {
      setIsModalOpen(true);
    }
  }, [maskImage]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMaskComplete = (newMaskedImage) => {
    console.log('Masked image i got is:', newMaskedImage)
    setMaskedImageData(newMaskedImage);
  };

  const handleDownload = async () => {
    if (!outputImageUrl) {
      console.error('No image URL to download');
      return;
    }
  
    try {
      const response = await fetch(outputImageUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'output-image.png';
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center space-x-4">
          <img
            src="/assets/images/datablocks.png"
            className="header-logo"
            alt="Datablocks logo"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded header-btn ${!outputImageUrl && 'opacity-50 cursor-not-allowed'}`}
            onClick={handleDownload}
            disabled={!outputImageUrl}
          >
            Download
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded header-btn">
            Sign in
          </button>
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          outputImageUrl={outputImageUrl}
          setOutputImageUrl={setOutputImageUrl}
          setGenerateText={setGenerateText}
          setBaseImage={setBaseImage}
          setMaskImage={setMaskImage}
          maskedImageData={maskedImageData}
        />
        <section className="flex-1 bg-white overflow-hidden relative">
          <div className="w-fit h-fit flex items-center justify-center mx-auto bg-white">
            {text ? (
              text
            ) : (
              outputImageUrl ? (
                <ReactBeforeSliderComponent
                  firstImage={{ imageUrl: outputImageUrl }}
                  secondImage={{ imageUrl: baseImage }}
                />
              ) : (
                <div></div>
              )
            )}
          </div>

          {isModalOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Canvas maskImage={maskImage} onClose={closeModal} onMaskComplete={handleMaskComplete} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
