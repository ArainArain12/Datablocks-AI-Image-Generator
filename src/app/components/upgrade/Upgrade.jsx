"use client"

import React, { Fragment } from "react";
import { auth } from "@/app/utils/firebaseConfig";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiArrowUpRight } from "react-icons/fi";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Upgrade() {
  const [user, loading] = useAuthState(auth); 
  const router = useRouter();

  // if (loading) {
  //   return <div>Loading...</div>; 
  // }

  const handleCheckout = async (amount) => {
    if (!user) {
      // router.push('/login'); 
      alert('Please login first')
      return;
    }

    const response = await fetch('/api/example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, uid: user.uid }), 
    });

    const session = await response.json();

    if (session.url) {
      window.location.href = session.url;
    } else {
      // router.push('/');
      console.log('No Success')
    }
  };


  return (
    <>
    <Navbar/>
    <div className="w-[90%] mx-auto pt-12 bg-white">
      <p className="spaceGrotesk text-[115px] leading-[110px]">
        SUBSCRIBE <br /> & JUST FLY.
      </p>
      <p className="Azeret mt-12 tracking-wide text-center w-[90%]">
        This is a paragraph where you can include any information you’d like.
        It’s an opportunity to tell a story about the company, describe a
        special service it offers, or highlight a particular feature that sets
        it apart from competitors.
      </p>
      <div className="MadeFor flex md:justify-between  justify-center md:gap-y-0 gap-y-7 lg:flex-nowrap flex-wrap mt-[210px]">
        <div className="xl:w-[28%] md:w-[32%] w-[70%] bg-[#c04921] rounded-[60px] pb-10 hover:bg-[#f8b394] UpgradePlans h-full">
          <FiArrowUpRight className="text-[90px] font-bold rotateArrow" />
          <p className="w-[70%] mx-auto text-[37px] font-bold -mt-4">Basic.</p>
          <p className="w-[70%] mx-auto text-sm text-white">
            Recomended for profesionals an small enterprise.
          </p>
          <p className="text-center text-[35px] font-bold m-0 p-0">39€</p>
          <p className="font-bold text-center m-0 p-0">/month.</p>
          <div
            className="w-full mt-3"
            style={{ border: ".3px dashed white" }}
          ></div>
          <p className="font-bold text-[#edd7be] text-center py-3">
            2.500 tokens /month
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <p className="font-bold text-[#edd7be] text-center py-3">
            200 designs
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <p className="font-bold text-[#edd7be] text-center py-3">
            100 upscales
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <button className="block mx-auto bg-white py-2 px-8 rounded-full mt-5" onClick={()=>handleCheckout(3900)}>
            Suscribe
          </button>
        </div>
        <div className="xl:w-[28%] md:w-[32%] w-[70%] bg-[#fa854f] rounded-[60px] pb-[60px] relative hover:bg-[#ffbfa1] UpgradePlans ">
          <FiArrowUpRight className="text-[90px] font-bold rotateArrow" />
          <div className="h-[70px] w-[70px] absolute top-4 right-4 bg-white rounded-full p-1 border border-dashed border-black">
          {/* <img src="./assets/star.svg" className="h-full w-full absolute" alt="" /> */}
          <img src="./assets/hand.svg" className="h-full w-full relative text-white" alt="" />
            
          </div>
          <p className="w-[70%] mx-auto text-[37px] font-bold -mt-4">Pro.</p>
          <p className="w-[70%] mx-auto text-sm text-white">
            Recomended for profesionals an small enterprise.
          </p>
          <p className="text-center text-[35px] font-bold m-0 p-0">95€</p>
          <p className="font-bold text-center m-0 p-0">/month.</p>
          <div
            className="w-full mt-3"
            style={{ border: ".3px dashed white" }}
          ></div>
          <p className="font-bold text-[#8f2907] text-center py-3">
          6.500 tokens /month
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <p className="font-bold text-[#8f2907] text-center py-3">
          500 designs
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <p className="font-bold text-[#8f2907] text-center py-3">
          250 upscales
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <button className="block mx-auto bg-white py-2 px-8 rounded-full mt-5" onClick={()=>handleCheckout(9500)}>
            Suscribe
          </button>
        </div>
        <div className="xl:w-[28%] md:w-[32%] w-[70%] bg-[#ffdebe] rounded-[60px] pb-10 hover:bg-[#ffbfa1] UpgradePlans h-full">
          <FiArrowUpRight className="text-[90px] font-bold rotateArrow" />
          <p className="w-[70%] mx-auto text-[37px] font-bold -mt-4">Enterprise.</p>
          <p className="w-[70%] mx-auto text-sm text-white">
            Recomended for profesionals an small enterprise.
          </p>
          <p className="text-center text-[35px] font-bold m-0 p-0">290€</p>
          <p className="font-bold text-center m-0 p-0">/month.</p>
          <div
            className="w-full mt-3"
            style={{ border: ".3px dashed white" }}
          ></div>
          <p className="font-bold text-center py-3">
          20.000 tokens /month
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <p className="font-bold text-center py-3">
          1600 designs
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <p className="font-bold  text-center py-3">
          800 upscales
          </p>
          <div className="w-full" style={{ border: ".3px dashed white" }}></div>
          <button className="block mx-auto bg-white py-2 px-8 rounded-full mt-5" onClick={()=>handleCheckout(29000)}>
            Suscribe
          </button>
        </div>
      </div>
      
    </div>
    <Footer/>
    </>

  );
}

export default Upgrade;
