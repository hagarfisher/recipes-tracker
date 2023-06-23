import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input } from "@mui/material";
import ResetPassword from "../src/components/Authentication/ResetPassword/ResetPassword";
import styles from "../styles/pages.module.scss";

export default function PasswordReset() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userId, secret, expire } = router.query;

  return (
    <div className={styles.container}>
      <ResetPassword
        userId={userId as string}
        secret={secret as string}
        expire={expire as string}
      />
    </div>
  );
}
