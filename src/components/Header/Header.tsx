import Link from "next/link";
import React, { useContext } from "react";
import { navLinks, RouteNames } from "../../utils/routes";
import styles from "./Header.module.scss";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Typography from "@mui/material/Typography";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import DrawerMenu from "./DrawerMenu";
import { useRouter } from "next/router";
const drawerWidth = 240;

export default function Header() {
  const router = useRouter();
  const { client, session, account, setSession } = useContext(
    AppWriteClientContext
  );

  const { isMobile } = useDeviceDetect();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    if (account) {
      const session = await account?.getSession("current");
      await account.deleteSession(session.$id);
      setSession(null);
      router.push("/");
    }
  };

  const linkToHome = (
    <Link
      className={styles["home-page-link"]}
      href={navLinks.find((item) => item.name === RouteNames.HOME)?.path ?? "/"}
    >
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Recipes Tracker
      </Typography>
    </Link>
  );

  const signOutButton = (
    <IconButton color="inherit" onClick={() => handleLogout()}>
      <LogoutOutlinedIcon fontSize="medium" />
    </IconButton>
  );

  const profileButton = (
    <IconButton color="inherit">
      <Link href="/profile">
        <AccountCircleRoundedIcon fontSize="large" />
      </Link>
    </IconButton>
  );
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  return (
    <Box className={styles["header"]} sx={{ flexGrow: 1 }}>
      <AppBar className={styles["app-bar"]} position="static">
        <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
          {session ? (
            isMobile ? (
              <div className={styles["mobile-menu-container"]}>
                <div className={styles["links-container"]}>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>

                  {linkToHome}
                </div>

                {signOutButton}
              </div>
            ) : (
              <div className={styles["nav-links"]}>
                {linkToHome}
                <div>
                  {navLinks.map((link, index) => {
                    return (
                      <Button color="inherit" key={link.path}>
                        <Link href={link.path}>{link.name}</Link>
                      </Button>
                    );
                  })}
                  {profileButton}
                  {signOutButton}
                </div>
              </div>
            )
          ) : (
            linkToHome
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            // display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <DrawerMenu
            navLinks={navLinks}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Drawer>
      </Box>
    </Box>
  );
}
