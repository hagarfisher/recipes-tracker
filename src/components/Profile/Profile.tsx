import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import { Account, Models } from "appwrite";

export default function Profile() {
  const { client } = useContext(AppWriteClientContext);
  const [userDetails, setUserDetails] =
    useState<Models.User<Models.Preferences>>();

  useEffect(() => {
    const getAccount = async () => {
      const user = await account?.get();
      console.log(user);
      if (user) {
        setUserDetails(user);
      }
    };
    if (!client) {
      return;
    }
    getAccount();
  }, []);

  if (!client) {
    return null;
  }
  const account = new Account(client);

  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>Profile</h1>
      <div className={styles["account-container"]}>
        <div className={styles["profile-details"]}>
          <AccountCircleRoundedIcon className={styles["profile-avatar"]} />
          <div className={styles["profile-detail"]}>
            <div className={styles["profile-detail-value"]}>
              {userDetails?.email}
            </div>
            <div className="profile-detail">
              <div className={styles["profile-detail-label"]}>Created At</div>
              <div className={styles["profile-detail-value"]}>
                {userDetails?.registration.split("T")[0]}
              </div>
            </div>
          </div>
        </div>
        <div className={styles["group-details"]}>
          <h2>My Group</h2>
          <div>Coming soon...</div>
        </div>
      </div>
    </div>
  );
}
