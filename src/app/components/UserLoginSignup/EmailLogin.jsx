import React, { Fragment, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { MdOutlineClear } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAuthState, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/utils/firebaseConfig";
import { myContext } from "@/app/Context/Context";
import { useRouter } from "next/navigation";
import { addUserToDatabase } from "../AddUserToDB/addUserToDatabase";

function EmailLogin() {
    const { setLoginEmailState, setSignupState } = useContext(myContext);

    const inpFilledRef = useRef();
    const navigate = useRouter();

    //FIREBASE DATA
    
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user && user.emailVerified) {
      navigate.push("/"); // Redirect if user is logged in and email is verified
    }
  }, [user,  navigate]);




    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let emailInput = e.target.email.value;
        let passwordInput = e.target.password.value;
    
        if (emailInput !== "" && passwordInput !== "") {
          inpFilledRef.current.style.display = "none";
          // save data to the database
    
          try{
        const res = await signInWithEmailAndPassword(emailInput, passwordInput);

        if (res) {
            if (res.user.emailVerified) {
              inpFilledRef.current.style.display = "none";
              navigate.push("/");
              setLoginEmailState(false)
            } else {
              await signOut(auth);
              inpFilledRef.current.innerHTML = "Please verify your email before logging in.";
              inpFilledRef.current.style.display = "block";
  
              // Optionally, resend verification email
              // await sendEmailVerification(res.user);
            }
          } else {
            inpFilledRef.current.innerHTML = "*Email & Password not matched";
            inpFilledRef.current.style.display = "block";
          }

    
          
    
    
          e.target.reset();
          
          
        } catch (err) {
          console.log(err)
        }
        } else {
          // display error message
          inpFilledRef.current.style.display = "block";
        }
      };
  return (
    <Fragment>
      <div className="w-full h-screen overflow-y-scroll fixed top-0 left-0 bg-black z-50 flex items-center flex-col text-white overFlow">
        <MdOutlineClear
          className="absolute top-[10%] right-[4%] text-[30px] cursor-pointer"
          onClick={() => setLoginEmailState(false)}
        />
        <h1 className="spaceGrotesk text-[50px] mt-[60px]">Iniciar sesión</h1>
        <p className="text-[20px] Azeret mt-2">
          ¿Eres nuevo en este sitio?{" "}
          <span
            className="text-red-600 cursor-pointer"
            onClick={() => {
              setLoginEmailState(false), setSignupState(true);
            }}
          >
            Regístrate
          </span>
        </p>
        <form action="" className="xl:w-[26%] w-[40%] Azeret" onSubmit={handleSubmit}>
          <label htmlFor="email" className="mt-8 block text-[12px]">
          <p
              ref={inpFilledRef}
              className="w-full text-red-600 text-sm hidden"
            >
              Fill all the fields
            </p>

            Email
            <input
              type="email"
              id="email"
              name="email"
              className="block py-2 w-full border-b-[1px] outline-none  hover:border-gray-100 focus:border-red-700 focus:border-b-[1px] border-gray-400 bg-transparent"
            />
          </label>
          <label htmlFor="password" className="mt-8 block text-[12px]">
            Contraseña
            <input
              type="password"
              id="password"
              name="password"
              className="block py-2 w-full border-b-[1px] outline-none  hover:border-gray-100 focus:border-red-700 focus:border-b-[1px] border-gray-400 bg-transparent"
            />
          </label>
          <Link href="" className="Azeret mt-5 block underline">
            ¿Olvidaste la contraseña?
          </Link>

          <button className={`py-3 block w-full bg-orange-700 mt-5 Arial`}>
            Iniciar sesión
          </button>
        </form>

       
      </div>
    </Fragment>
  );
}

export default EmailLogin;
