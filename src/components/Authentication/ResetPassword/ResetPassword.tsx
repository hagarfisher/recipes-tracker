import { Button, Input } from "@mui/material";
import React, { useState, useContext } from "react";
import styles from "./ResetPassword.module.scss";
import { AppWriteClientContext } from "../../../contexts/AppWriteClientContext/AppWriteClientContext";
import { useRouter } from "next/router";

interface Props {
  userId: string;
  secret: string;
  expire: string;
}
export default function ResetPassword({ userId, secret, expire }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { account } = useContext(AppWriteClientContext);
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      if (account) {
        if (
          password === confirmPassword &&
          password !== "" &&
          confirmPassword !== ""
        ) {
          await account.updateRecovery(
            userId,
            secret,
            password,
            confirmPassword
          );
          console.log("Password updated successfully");
          router.push("/");
        }
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className={styles["reset-form"]}>
      <h1>Reset Password</h1>
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button variant="contained" onClick={() => handleSubmit()}>
        Reset Password
      </Button>
    </div>
  );
}
