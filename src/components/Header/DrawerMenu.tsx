import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Link from "next/link";
import React from "react";
import { RouteNames } from "../../utils/routes";

function Drawer({
  navLinks,
  handleDrawerToggle,
}: {
  navLinks: {
    name: RouteNames;
    path: string;
  }[];
  handleDrawerToggle: () => void;
}) {
  const supabase = useSupabaseClient();
  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Recipe Tracker
      </Typography>
      <Divider />
      <List>
        <ListItem>
          <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
        </ListItem>
        {navLinks.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link href={item.path}>{item.name}</Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Drawer;
