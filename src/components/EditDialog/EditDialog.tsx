import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Meal, MealEnrichedWithCookingEvents } from "../../types/meals";
import { Database, ModelNames } from "../../utils/models";
import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./EditDialog.module.scss";

interface Props {
  mealData?: MealEnrichedWithCookingEvents;
  isOpen: boolean;
  handleClose: () => void;
  syncMealData: (mealData: MealEnrichedWithCookingEvents) => void;
}

export default function EditDialog({
  mealData,
  isOpen,
  handleClose,
  syncMealData,
}: Props) {
  const [title, setTitle] = useState(mealData?.name);
  const [description, setDescription] = useState(mealData?.description);
  const [recipeUrl, setRecipeUrl] = useState(mealData?.recipe_url);
  const [mealImageUrl, setMealImageUrl] = useState(mealData?.image_url);
  const supabase = useSupabaseClient<Database>();
  const user = useUser();

  async function updateOrCreateMeal(mealData: Partial<Meal>) {
    try {
      const { data: freshMealDataFromServer, error } = await supabase
        .from(ModelNames.MEALS)
        .upsert({
          ...{
            id: mealData.id,
            name: title,
            description: description,
            recipe_url: recipeUrl,
            image_url: mealImageUrl,
          },
          created_by: user!.id,
          updated_at: new Date(),
        })
        .select(`*, ${ModelNames.COOKING_EVENTS} (id, created_at)`)
        .single();
      if (error) {
        console.error(error);
      } else {
        console.log("Meal updated!", freshMealDataFromServer);
        syncMealData(freshMealDataFromServer as MealEnrichedWithCookingEvents);
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  }

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
        <RecipeCard
          mealData={mealData!}
          withActions={false}
          isEditMode={true}
          setDescription={setDescription}
          setTitle={setTitle}
          setRecipeUrl={setRecipeUrl}
          setMealImageUrl={setMealImageUrl}
        />
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button
          onClick={() => {
            updateOrCreateMeal(mealData!);
          }}
        >
          {"I'm done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
