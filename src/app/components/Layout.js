"use client";
import Sidebar from "./Sidebar";
import "../style.css";
import { useState } from "react";

export default function Layout({ children }) {
  const [outputImageUrl, setOutputImageUrl] = useState(null);
  const [text, setGenerateText] = useState(null);
  return (
    <div className={`flex flex-col h-screen bg-white text-black`}>
      <header className="flex justify-between items-center p-4 bg-white ">
        <div className="flex items-center space-x-4">
          <img
            src="/assets/images/datablocks.png"
            className="header-logo"
            alt="Datablocks logo"
          />
        </div>
        <div className="flex items-center space-x-4">
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
        />
        <section className="flex-1 p-4 bg-white overflow-hidden  ">
          {/* Main Body content */}
          <div className="w-full p-2 h-full bg-white border-2 border-black">
            {text ? (
              text
            ) : (
              <div>
                <img src={outputImageUrl}></img>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
