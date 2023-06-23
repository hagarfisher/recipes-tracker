import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AddIcon from "@mui/icons-material/Add";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import { Account, Models } from "appwrite";
import { AppBar, Button, Dialog, IconButton, Typography } from "@mui/material";
import ManageGroups from "../ManageGroups/ManageGroups";

export default function Profile() {
  const { client } = useContext(AppWriteClientContext);
  const [userDetails, setUserDetails] =
    useState<Models.User<Models.Preferences>>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getAccount = async () => {
      const user = await account?.get();
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
    <>
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
            <h2>My Groups</h2>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <AddIcon /> Create Group
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <ManageGroups setIsDialogOpen={setIsDialogOpen} />
      </Dialog>
    </>
  );
}
