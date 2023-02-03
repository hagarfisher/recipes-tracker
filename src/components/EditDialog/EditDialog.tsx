import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MealEnrichedWithCookingEvents } from "../../types/meals";
import styles from "./EditDialog.module.scss";
import RecipeCard from "../RecipeCard/RecipeCard";

interface Props {
  mealData: Partial<MealEnrichedWithCookingEvents>;
  isOpen: boolean;
  handleClose: () => void;
}

export default function EditDialog({ mealData, isOpen, handleClose }: Props) {
  return (
    <Dialog
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
      className={styles["dialog-wrapper"]}
    >
      <DialogTitle id="edit-dialog-title">{"Edit Meal"}</DialogTitle>
      <DialogContent>
        <RecipeCard mealData={mealData} withActions={false} isEditMode={true} />
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{"I'm done"}</Button>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
