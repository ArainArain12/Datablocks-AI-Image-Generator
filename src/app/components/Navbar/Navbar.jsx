"use client";

import React, { Fragment, useContext } from "react";
import { myContext } from "@/app/Context/Context";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

function Navbar() {
  const { setSignupState, userAvail } = useContext(myContext);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useRouter();


  return (
    <Fragment>
      <nav className=" pt-9 w-[90%] mx-auto flex justify-between ">
        <div className="flex gap-3 items-center w-[15%]">
          <img
            src="./assets/profile.svg"
            alt="No Img Found"
            className="h-[30px] w-[30px]"
          />
          {!userAvail && (
            <p
              className="cursor-pointer Azeret text-[12px] tracking-tighter"
              onClick={() => setSignupState(true)}
            >
              Iniciar sesión
            </p>
          )}
          {userAvail && (
            <>
              <p className="cursor-pointer Azeret text-[12px] tracking-tighter text-nowrap">
                {user?.displayName || "User-2746"}
              </p>{" "}
              <p
                onClick={() => {
                  signOut(auth);
                }}
                className="text-[#F05454] text-sm cursor-pointer ms-3"
              >
                Logout
              </p>
            </>
          )}
        </div>
        <div className="w-[35%] flex flex-col items-center">
          <img
            src="./assets/logo_horz.png"
            alt="No Img Found"
            className="w-[70%] ms-auto"
          />
        </div>
        <ul className="flex items-center justify-between w-[27%] text-[15px] font-light Arial">
          <li onClick={()=>navigate.push('/upgrade')}>Upgrade</li>
          <li>Terms & Conditions</li>
          <li>Blog</li>
        </ul>
      </nav>
      <div className="w-[95%]">
        <marquee
          scrollamount="5"
          className="cursor-pointer text-nowrap mt-8 text-[17px] text-orange-700 block mx-auto w-[35%] Azeret"
        >
          YOUR GENERATIVE AI DESIGN TOOL // ON BASED ON STABLE DIFFUSSION
        </marquee>
      </div>
    </Fragment>
  );
}

export default Navbar;
