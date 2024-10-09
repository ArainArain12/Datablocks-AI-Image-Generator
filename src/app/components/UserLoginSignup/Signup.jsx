import React, { Fragment, useContext } from 'react';
import { myContext } from '@/app/Context/Context';
import { MdOutlineClear } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { auth, googleProvider, facebookProvider } from '@/app/utils/firebaseConfig'; // Adjust the import path if needed
import { signInWithPopup } from 'firebase/auth';
import { addUserToDatabase } from '../AddUserToDB/addUserToDatabase';

function Signup() {
  const { setLoginState, setSignupState, setSignupEmailState } = useContext(myContext);

  // Function to sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Call the function to add user data to the database (tokens, designs, upscale)
      await addUserToDatabase(user.uid); 

      setSignupState(false)
      // You can handle the user object as needed (e.g., save to database or redirect)
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  // Function to sign in with Facebook
  // const handleFacebookSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, facebookProvider);
  //     console.log('Facebook sign-in successful:', result.user);
  //     // Handle the user object here
  //   } catch (error) {
  //     console.error('Facebook sign-in error:', error);
  //   }
  // };

  return (
    <Fragment>
      <div className="w-full h-screen overflow-y-scroll fixed top-0 left-0 bg-black z-50 flex items-center flex-col text-white overFlow">
        <MdOutlineClear
          className="absolute top-[10%] right-[4%] text-[30px] cursor-pointer"
          onClick={() => setSignupState(false)}
        />
        <h1 className="spaceGrotesk text-[50px]">Regístrate</h1>
        <p className="text-[20px] Azeret mt-2">
          ¿Ya tienes un perfil personal?{" "}
          <span
            className="text-red-600 cursor-pointer"
            onClick={() => {
              setSignupState(false);
              setLoginState(true);
            }}
          >
            Iniciar sesión
          </span>
        </p>

        {/* Google Signup Button */}
        <button
          className="xl:w-[25%] w-[35%] py-3 border border-black bg-white text-black Arial relative flex items-center justify-center mt-10"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="absolute left-3 text-[27px]" />
          Registrarse con Google
        </button>

        {/* Facebook Signup Button */}
        {/* <button
          className="xl:w-[25%] w-[35%] py-3 border border-black bg-blue-500 text-white Arial relative flex items-center justify-center mt-4"
          onClick={handleFacebookSignIn}
        >
          <FaFacebook className="absolute left-3 text-[27px]" />
          Registrarse con Facebook
        </button> */}

        <div className="flex justify-between items-center xl:w-[25%] w-[35%] mt-4">
          <div className="w-[45%] bg-gray-400 h-[.3px]"></div>
          <p>o</p>
          <div className="w-[45%] bg-gray-400 h-[.3px]"></div>
        </div>

        <button
          className="xl:w-[45%] w-[55%] border border-gray-400 py-2 mt-2"
          onClick={() => {
            setSignupEmailState(true);
            setSignupState(false);
          }}
        >
          Registrarse con un email
        </button>

        <p className="Azeret xl:w-[45%] w-[55%] text-center mt-12">
          Tu perfil se configurará como público automáticamente cuando te registres. 
          Puedes cambiarlo más tarde en la configuración de tu perfil.
        </p>
      </div>
    </Fragment>
  );
}

export default Signup;
