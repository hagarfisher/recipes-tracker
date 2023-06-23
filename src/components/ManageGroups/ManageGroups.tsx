import {
  AppBar,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Avatar,
} from "@mui/material";
import styles from "./ManageGroups.module.scss";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { use, useContext, useEffect, useState } from "react";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import { Client, Teams, ID, Models } from "appwrite";

interface Props {
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}
export default function ManageGroups({ setIsDialogOpen }: Props) {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { client } = useContext(AppWriteClientContext);
  // we can cast client to Client because we know it's not null in this component
  const enforcedClient = client as Client;
  const teams = new Teams(enforcedClient);
  const [groups, setGroups] = useState<Models.Team<Models.Preferences>[]>();
  const [groupMembers, setGroupMembers] = useState<Models.Membership[]>();

  const getTeams = async () => {
    const { total, teams: groups } = await teams.list();
    setGroups(groups);
    console.log(groups);
  };
  const fetchMemberList = async (groupId: string) => {
    const { total, memberships } = await teams.listMemberships(groupId);
    console.log(memberships);
    setGroupMembers(memberships);
  };
  useEffect(() => {
    setLoading(true);
    try {
      getTeams();
      if (groups) {
        fetchMemberList(groups[0].$id);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, []);
  const handleAddGroup = async () => {
    try {
      setLoading(true);
      const result = await teams.create(ID.unique(), groupName);
      console.log(result);
      setGroupName("");
      await getTeams();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <div>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => {
              setIsDialogOpen(false);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Manage Groups
          </Typography>
          {/* <Button
            autoFocus
            color="inherit"
            onClick={() => {
              setIsDialogOpen(false);
            }}
          >
            save
          </Button> */}
        </Toolbar>
      </AppBar>
      <div className={styles.container}>
        <div>
          <h2>Add Group</h2>
          <div>
            <TextField
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              value={groupName}
              size="small"
              label="Group Name"
              variant="outlined"
            >
              Group Name
            </TextField>
            <LoadingButton
              variant="outlined"
              loading={loading}
              onClick={handleAddGroup}
              loadingPosition="start"
            >
              Add
            </LoadingButton>
          </div>
        </div>
        <div className={styles["groups-container"]}>
          <div>
            <h2>My Groups</h2>
            <div className={styles["my-groups"]}>
              {groups?.map((group, index) => {
                return (
                  <Button
                    onClick={() => fetchMemberList(group.$id)}
                    className={styles["group"]}
                    key={index}
                    variant="outlined"
                  >
                    <span>
                      <Avatar className={styles["group-avatar"]}>
                        {`${group.name.split(" ")[0][0].toUpperCase()}${
                          group.name.split(" ")?.[1]?.[0].toUpperCase() ?? ""
                        }`}
                      </Avatar>
                    </span>
                    {group.name}
                    <KeyboardArrowRightIcon fontSize="small" />
                  </Button>
                );
              })}
            </div>
          </div>
          <div className={styles["group-details"]}>
            <h3>Group Members</h3>
            <div className={styles["group-members"]}>
              {groupMembers?.map((member, index) => {
                return (
                  <div className={styles["group-member"]} key={index}>
                    <Avatar className={styles["member-avatar"]}>
                      {`${member.userEmail[0].toUpperCase()}`}
                    </Avatar>
                    <div className={styles["group-member-email"]}>
                      {member.userEmail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
