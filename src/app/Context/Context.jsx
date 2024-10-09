"use client";

import React, { createContext, Fragment, useState } from "react";

export const myContext = createContext();
function Context({ children }) {
  const [signupState, setSignupState] = useState(false);
  const [loginState, setLoginState] = useState(false);
  const [signupEmailState, setSignupEmailState] = useState(false);
  const [loginEmailState, setLoginEmailState] = useState(false);
  const [userAvail, setUserAvail] = useState(false);
  return (
    <Fragment>
      <myContext.Provider
        value={{
          signupState,
          setSignupState,
          loginState,
          setLoginState,
          signupEmailState,
          setSignupEmailState,
          loginEmailState,
          setLoginEmailState,
          userAvail,
          setUserAvail,
        }}
      >
        {children}
      </myContext.Provider>
    </Fragment>
  );
}

export default Context;
