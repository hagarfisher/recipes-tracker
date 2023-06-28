import styles from "./Auth.module.scss";
import {
  Button,
  TextField,
  InputAdornment,
  Typography,
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ID, Models } from "appwrite";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { setSession, account } = useContext(AppWriteClientContext);

  const { asPath } = useRouter();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const passwordResetUrl = `${origin}${asPath}\password-reset`;
  const handleResetDialogClose = () => setIsResetDialogOpen(false);
  const resetPassword = async () => {
    try {
      if (account) {
        if (!resetEmail || resetEmail === "") {
          setError("Please enter your email.");
          return;
        }
        await account.createRecovery(resetEmail, passwordResetUrl);
        setIsResetDialogOpen(false);
      }
    } catch (e: any) {
      setError("Something went wrong. Please try again.");
    }
  };

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
  const signInAsGuest = async () => {
    try {
      const session = await account.createAnonymousSession();
      setSession(session);
    } catch (e: any) {
      setError("Something went wrong. Please try again.");
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
            type="email"
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
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {isSignIn && (
            <div
              className={styles["forgot-password"]}
              onClick={() => setIsResetDialogOpen(true)}
            >
              <Typography fontSize={"0.8em"}>Forgot your password?</Typography>
            </div>
          )}
          <div>
            <Dialog open={isResetDialogOpen} onClose={handleResetDialogClose}>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To reset your password please enter your email address here.
                </DialogContentText>
                <TextField
                  onChange={(e) => setResetEmail(e.target.value)}
                  value={resetEmail}
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleResetDialogClose}>Cancel</Button>
                <Button onClick={resetPassword}>Send a reset email</Button>
              </DialogActions>
            </Dialog>
          </div>
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
        <Button
          variant="outlined"
          className={styles["guest-button"]}
          onClick={() => signInAsGuest()}
        >
          or Continue as Guest{" "}
          <ArrowForwardIcon className={styles.icon} fontSize="small" />
        </Button>
      </div>
    </div>
  );
}
