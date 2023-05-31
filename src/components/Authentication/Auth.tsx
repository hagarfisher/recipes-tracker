import styles from "./Auth.module.scss";
import {
  Button,
  TextField,
  InputAdornment,
  Typography,
  Alert,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useContext, useEffect, useState } from "react";

import { ID, Models } from "appwrite";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import Error from "next/error";
import { ElevatorSharp } from "@mui/icons-material";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [error, setError] = useState("");
  const { setSession, account } = useContext(AppWriteClientContext);

  useEffect(() => {
    setError("");
  }, [isSignIn]);

  if (!account) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      if (isSignIn) {
        const session = await account.createEmailSession(email, password);
        setSession(session);
      } else {
        // "user_already_exists
        const user = await account.create(ID.unique(), email, password);
      }
    } catch (e: any) {
      if (e.type === "user_already_exists") {
        setError("Looks like you already have an account. Please log in.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const signUpText = (
    <div>
      Don&apos;t have an account? &nbsp;
      <span
        className={styles["toggle-link"]}
        onClick={() => setIsSignIn(!isSignIn)}
      >
        Sign Up
      </span>
    </div>
  );
  const signInText = (
    <div>
      Already have an account? &nbsp;
      <span
        className={styles["toggle-link"]}
        onClick={() => setIsSignIn(!isSignIn)}
      >
        Sign In
      </span>
    </div>
  );
  return (
    <div className={styles["container"]}>
      <Typography variant="h4" component="h1">
        {isSignIn ? "Login" : "Create Account"}
      </Typography>
      <div className={styles["auth-container"]}>
        <div className={styles["form-fields"]}>
          <TextField
            id="email"
            placeholder="Email"
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="password"
            placeholder="Password"
            type="password"
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            // autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {error && (
            <Alert className={styles[error]} severity="error">
              {error}
            </Alert>
          )}
        </div>

        <div className={styles["auth-button"]}>
          <Button variant="contained" onClick={() => handleSubmit()}>
            {isSignIn ? "Log in" : "Sign up"}
            <ArrowForwardIcon className={styles.icon} fontSize="small" />
          </Button>
        </div>
        {isSignIn ? signUpText : signInText}
      </div>
    </div>
  );
}
