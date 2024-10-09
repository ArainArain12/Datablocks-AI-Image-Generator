"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebaseConfig";
import Upgrade from "../components/upgrade/Page";
import { myContext } from "../Context/Context";

import EmailSignup from "../components/UserLoginSignup/EmailSignup";
import EmailLogin from "../components/UserLoginSignup/EmailLogin";
import Signup from "../components/UserLoginSignup/Signup";
import Login from "../components/UserLoginSignup/Login";



export default function Home() {
  // USED STATES
  const { signupState, loginState, signupEmailState, loginEmailState, setUserAvail } = useContext(myContext);
  // const [signupState, setSignupState] = useState(false);
  
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user && user.emailVerified) {
      setUserAvail(true)
    }else{
      setUserAvail(false)
    }
  }, [user]);
  

  
  return (
    <>
      {signupState && <Signup />}

      {loginState && <Login />}

      {signupEmailState && <EmailSignup />}

      {loginEmailState && <EmailLogin />}
      <Upgrade />
    </>
  );
}
