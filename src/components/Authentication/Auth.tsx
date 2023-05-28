import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { ID } from "appwrite";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const { account } = useContext(AppWriteClientContext);

  if (!account) {
    return null;
  }

  const handleSubmit = async () => {
    if (isSignIn) {
      await account.createEmailSession(email, password);
    } else {
      await account.create(ID.unique(), email, password);
    }
  };

  return (
    <div>
      <TextField
        id="email"
        label="Email"
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Button variant="contained" onClick={() => handleSubmit()}>
        {isSignIn ? "Log in" : "Sign up"}
      </Button>
      {isSignIn ? (
        <div>Don&apos;t have an account?</div>
      ) : (
        <div>Already have an account?</div>
      )}
      <span onClick={() => setIsSignIn(!isSignIn)}>
        {isSignIn ? "Sign in" : "Sign Up"}
      </span>
    </div>
  );
}
