import React, { Fragment, useContext } from 'react'
import { myContext } from '@/app/Context/Context';
import { MdOutlineClear } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { auth, googleProvider, facebookProvider } from '@/app/utils/firebaseConfig'; // Adjust the import path if needed
import { signInWithPopup } from 'firebase/auth';
import { addUserToDatabase } from '../AddUserToDB/addUserToDatabase';

function Login() {
  const { setLoginState, setSignupState, setLoginEmailState } = useContext(myContext);


  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Call the function to add user data to the database (tokens, designs, upscale)
      await addUserToDatabase(user.uid); 
      setLoginState(false)
      // You can handle the user object as needed (e.g., save to database or redirect)
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <Fragment>
      <div className="w-full h-screen overflow-y-scroll fixed top-0 left-0 bg-black z-50 flex items-center flex-col text-white overFlow">
          <MdOutlineClear
            className="absolute top-[10%] right-[4%] text-[30px] cursor-pointer"
            onClick={() => setLoginState(false)}
          />
          <h1 className="spaceGrotesk text-[50px]">Iniciar sesión</h1>
          <p className="text-[20px] Azeret mt-2">
            ¿Eres nuevo en este sitio?{" "}
            <span
              className="text-red-600 cursor-pointer"
              onClick={() => {
                setSignupState(true), setLoginState(false);
              }}
            >
              Regístrate
            </span>
          </p>
          <button className="xl:w-[25%] w-[35%] py-3 border border-black bg-white text-black Arial relative flex items-center justify-center mt-10" onClick={handleGoogleSignIn}>
            <FcGoogle className="absolute left-3 text-[27px]" /> Iniciar sesión
            con Google
          </button>
          {/* <button className="xl:w-[25%] w-[35%] py-3 border border-black bg-blue-500 text-white Arial relative flex items-center justify-center mt-4">
            <FaFacebook className="absolute left-3 text-[27px]" /> Continuar con
            Facebook
          </button> */}
          <div className="flex justify-between items-center w-[25%] mt-4">
            <div className="w-[45%] bg-gray-400 h-[.3px]"></div>
            <p>o</p>
            <div className="w-[45%] bg-gray-400 h-[.3px]"></div>
          </div>
          <button
            className="xl:w-[45%] w-[55%] border border-gray-400 py-2 mt-2"
            onClick={() => {
              setLoginEmailState(true), setLoginState(false);
            }}
          >
            Iniciar sesión con tu email
          </button>
        </div>
    </Fragment>
  )
}

export default Login
