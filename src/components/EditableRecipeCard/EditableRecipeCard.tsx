import React, { useEffect, useState } from "react";
import { MouseEventHandler } from "react";
import { useResolveImageUrl } from "../../hooks/useResolveImageUrl";
import { defaultImagePath } from "../../utils/constants";
import { CollectionNames, Database, ModelNames } from "../../utils/models";
import { v4 as uuidv4 } from "uuid";

import {
  Meal,
  Meal as MealType,
  MealEnrichedWithCookingEvents,
} from "../../types/meals";
import styles from "./EditableRecipeCard.module.scss";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Picture from "../Picture/Picture";

interface Props {
  mealData?: MealEnrichedWithCookingEvents;
  isOpen: boolean;
  handleClose: () => void;
  syncMealData: (mealData: MealEnrichedWithCookingEvents) => void;
}

export default function EditableRecipeCard({
  mealData,
  isOpen,
  handleClose,
  syncMealData,
}: Props) {
  const [title, setTitle] = useState(mealData?.name ?? "");
  const [description, setDescription] = useState(mealData?.description ?? "");
  const [recipeUrl, setRecipeUrl] = useState(mealData?.recipe_url ?? "");
  const [mealImageUrl, setMealImageUrl] = useState(
    mealData?.image_url ?? defaultImagePath
  );

  const supabase = useSupabaseClient<Database>();
  const user = useUser();

  // const { imageUrl, isLoading, error } = useResolveImageUrl(
  //   CollectionNames.MEAL_IMAGES,
  //   mealImageUrl ?? defaultImagePath
  // );
  async function updateOrCreateMeal(mealData: Partial<Meal>) {
    try {
      const { data: freshMealDataFromServer, error } = await supabase
        .from(ModelNames.MEALS)
        .upsert({
          ...{
            id: mealData?.id,
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
    <>
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
          <Card className={styles.card}>
            {
              <>
                <div className={styles["edit-overlay"]}>
                  <CardMedia
                    className={styles["card-media"]}
                    sx={{ height: 140 }}
                    image={mealImageUrl}
                    title="recipe-thumbnail"
                  />

                  <div className={styles["edit-icon"]}>
                    <Picture
                      unique_id={uuidv4()}
                      url={mealImageUrl ?? ""}
                      size={150}
                      onUpload={(url: string) => {
                        console.log("this is from editable card ", url);
                        if (setMealImageUrl) {
                          setMealImageUrl(url);
                        }
                      }}
                      collectionName={CollectionNames.MEAL_IMAGES}
                      canEdit={true}
                    />
                  </div>
                </div>
              </>
            }

            <CardContent className={styles["card-content"]}>
              <TextField
                variant="standard"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Recipe title.."
              />

              <TextField
                placeholder="Description.."
                variant="standard"
                value={description}
                multiline
                maxRows={5}
                onChange={(event) => setDescription(event.target.value)}
              />

              <TextField
                variant="standard"
                value={recipeUrl}
                onChange={(event) => setRecipeUrl(event.target.value)}
                placeholder="https://recipes-tracker.strafer.dev/"
              />
            </CardContent>
          </Card>
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
    </>
  );
}
