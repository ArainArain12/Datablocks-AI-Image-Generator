import React, { Fragment, useContext, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import { MdOutlineClear } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

// FIREBASE IMPORTS
import {
  useCreateUserWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/utils/firebaseConfig";
import { sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { myContext } from "@/app/Context/Context";
import { addUserToDatabase } from "../AddUserToDB/addUserToDatabase";

function EmailSignup() {


    const { setLoginState, setSignupEmailState } = useContext(myContext);
    const [emailUse, setEmailUse] = useState(false);


    const inpFilledRef = useRef();
  
    // FIREBASE DATA
    const [createUserWithEmailAndPassword, user, loading, error] =
      useCreateUserWithEmailAndPassword(auth);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let nameInput = e.target.name.value;
        let emailInput = e.target.email.value;
        let passwordInput = e.target.password.value;
    
        if (nameInput !== "" && emailInput !== "" && passwordInput !== "") {
          inpFilledRef.current.style.display = "none";
          // save data to the database
    
          try{
          const userCredential = await createUserWithEmailAndPassword(
            emailInput,
            passwordInput
          );
    
          if (!userCredential || !userCredential.user) {
            setEmailUse(true);
          } else {
            setEmailUse(false);
          }
          
          
          const user = userCredential.user;
          await addUserToDatabase(user.uid);
          // Update profile with displayName
          await updateProfile(user, { displayName: nameInput });
          await sendEmailVerification(user);
          await signOut(auth);
    
    
          e.target.reset();
          
          toast.success("Account created! Please verify your email.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } catch (err) {
          toast.error("Something went wrong", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        } else {
          // display error message
          inpFilledRef.current.style.display = "block";
        }
      };
  return (
    <Fragment>
      <div className="w-full h-screen overflow-y-scroll fixed top-0 left-0 bg-black z-50 flex items-center flex-col text-white overFlow">
        <ToastContainer />
        <MdOutlineClear
          className="absolute top-[10%] right-[4%] text-[30px] cursor-pointer"
          onClick={() => setSignupEmailState(false)}
        />
        <h1 className="spaceGrotesk text-[50px] mt-[60px]">Regístrate</h1>
        <p className="text-[20px] Azeret mt-2">
          ¿Ya tienes un perfil personal?{" "}
          <span
            className="text-red-600 cursor-pointer"
            onClick={() => {
              setSignupEmailState(false), setLoginState(true);
            }}
          >
            Iniciar sesión
          </span>
        </p>
        <form action="" className="xl:w-[26%] w-[40%] Azeret" onSubmit={handleSubmit}>
          <label htmlFor="name" className="mt-8 block text-[12px]">
            <p
              ref={inpFilledRef}
              className="w-full text-red-600 text-sm hidden"
            >
              Fill all the fields
            </p>
            Name*
            <input
              type="text"
              id="name"
              name="name"
              className="block py-2 w-full border-b-[1px] outline-none  hover:border-gray-100 focus:border-red-700 focus:border-b-[1px] border-gray-400 bg-transparent"
            />
          </label>
          <label htmlFor="email" className="mt-8 block text-[12px]">
            Email*
            <input
              type="email"
              id="email"
              name="email"
              className="block py-2 w-full border-b-[1px] outline-none  hover:border-gray-100 focus:border-red-700 focus:border-b-[1px] border-gray-400 bg-transparent"
            />
          </label>
          {emailUse && (
            <p className="text-red-800 text-sm">Email is already in use.</p>
          )}
          <label htmlFor="password" className="mt-8 block text-[12px]">
            Contraseña*
            <input
              type="password"
              id="password"
              name="password"
              className="block py-2 w-full border-b-[1px] outline-none  hover:border-gray-100 focus:border-red-700 focus:border-b-[1px] border-gray-400 bg-transparent"
            />
          </label>

          <button className={`py-3 block w-full bg-orange-700 mt-5 Arial`}>
            Regístrate
          </button>
        </form>
        <p className="Azeret xl:w-[45%] w-[60%] text-center mt-12">
          Tu perfil se configurará como público automáticamente cuando te
          registres. Puedes cambiarlo más tarde en la configuración de tu
          perfil.
        </p>
      </div>
    </Fragment>
  );
}

export default EmailSignup;
