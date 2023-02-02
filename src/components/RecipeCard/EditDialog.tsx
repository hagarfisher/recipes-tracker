import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import RecipeCard from "./RecipeCard";
import { MealEnrichedWithCookingEvents } from "../../types/meals";

interface Props {
  mealData: Partial<MealEnrichedWithCookingEvents>;
  withActions?: boolean;
}

export default function EditDialog({ mealData, withActions }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="edit"
        component="label"
        onClick={handleClickOpen}
      >
        <ModeEditOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle id="edit-dialog-title">{"Edit Meal"}</DialogTitle>
        <DialogContent>
          <RecipeCard mealData={mealData} withActions={false} />
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
