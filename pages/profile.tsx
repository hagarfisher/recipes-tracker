import React from "react";
import styles from "../styles/pages.module.scss";
import Profile from "../src/components/Profile/Profile";

export default function profile() {
  return (
    <div className={styles.container}>
      <Profile />
    </div>
  );
}
