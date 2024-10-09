"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../style.css";
import dynamic from "next/dynamic";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";
import Canvas from "../utils/canvas";
import { auth } from "@/app/utils/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref, onValue } from "firebase/database"; // Import Realtime Database methods
import { useRouter } from "next/navigation";
import { IoIosAddCircleOutline } from "react-icons/io";


const LoadingAnimation = dynamic(() => import("./LoadingAnimation"), {
  ssr: false,
});
export default function Layout({ children }) {
  const [outputImageUrl, setOutputImageUrl] = useState("");
  const [text, setGenerateText] = useState(null);
  const [baseImage, setBaseImage] = useState(null);
  const [currentMaskImage, setCurrentMaskImage] = useState(null);
  const [maskImages, setMaskImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maskedImageData, setMaskedImageData] = useState(null);
  const [credits, setCredits] = useState(0); // State to store credits
  const [user] = useAuthState(auth);
  const navigate = useRouter()




  useEffect(() => {
    if (currentMaskImage) {
      setIsModalOpen(true);
    }
  }, [currentMaskImage]);

  useEffect(() => {
  
    if (user) {
      const db = getDatabase(); // Initialize Firebase Realtime Database
      const creditsRef = ref(db, `users/${user.uid}/tokens`); // Reference to user's credits
      onValue(creditsRef, (snapshot) => {
        const data = snapshot.val();
        setCredits(data || 0); // Update state with the fetched credits or 0 if none exists
        // setLoading(false); // Set loading to false after fetching data

      });
    }

  }, [user]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMaskImage(null);
  };

  const handleMaskComplete = (newMaskedImage) => {
    setMaskedImageData(newMaskedImage);
    setMaskImages((prev) => [...prev, newMaskedImage]);
    setCurrentMaskImage(null);
    closeModal();
  };

  const handleDownload = async () => {
    if (!outputImageUrl) {
      console.error("No image URL to download");
      return;
    }

    try {
      const response = await fetch(outputImageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "output-image.png";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
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
        <button className="px-4 py-3 bg-blue-500 text-white rounded header-btn text-[12px] text-nowrap cursor-default flex items-center">
            Tokens: <span className="ms-1">{credits} </span>
            <IoIosAddCircleOutline className="ms-2 cursor-pointer" onClick={()=> navigate.push('/upgrade')}/>
          </button>
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded header-btn ${
              !outputImageUrl && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleDownload}
            disabled={!outputImageUrl}
          >
            Download
          </button>
          {
          user ?  <button className="px-4 py-2 bg-blue-500 text-white rounded header-btn text-nowrap cursor-default">
          {user.displayName}
        </button> :  <button className="px-4 py-2 bg-blue-500 text-white rounded header-btn text-nowrap" onClick={()=> navigate.push('/upgrade')}>
          Sign in
        </button>
          }
          
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          outputImageUrl={outputImageUrl}
          setOutputImageUrl={setOutputImageUrl}
          setGenerateText={setGenerateText}
          setBaseImage={setBaseImage}
          setCurrentMaskImage={setCurrentMaskImage}
          maskImages={maskImages}
        />
        <section className="flex-1 bg-white relative overflow-scroll">
          <div className="w-fit h-fit flex items-center justify-center mx-auto bg-white">
            {text ? (
              <LoadingAnimation></LoadingAnimation>
            ) : outputImageUrl ? (
              <ReactBeforeSliderComponent
                firstImage={{ imageUrl: outputImageUrl }}
                secondImage={{ imageUrl: baseImage }}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div></div>
            )}
          </div>

          {isModalOpen && currentMaskImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Canvas
                maskImage={currentMaskImage}
                onClose={closeModal}
                onMaskComplete={handleMaskComplete}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
