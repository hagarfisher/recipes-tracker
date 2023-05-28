import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log(email);
  }, [email]);

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
      <button>Sign Up</button>
    </div>
  );
}
