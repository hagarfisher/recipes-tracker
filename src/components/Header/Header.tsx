import React from "react";
import { navLinks, RouteNames } from "../../utils/routes";
import Link from "next/link";
import styles from "./Header.module.scss";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Drawer } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import DrawerMenu from "./DrawerMenu";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "@supabase/auth-helpers-react";

const drawerWidth = 240;

export default function Header() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const { isMobile } = useDeviceDetect();
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
    <IconButton color="inherit" onClick={() => supabase.auth.signOut()}>
      <LogoutOutlinedIcon />
    </IconButton>
  );
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  return (
    <Box className={styles["header"]} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
          {isMobile ? (
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

              {session && signOutButton}
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
                {session && signOutButton}
              </div>
            </div>
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
