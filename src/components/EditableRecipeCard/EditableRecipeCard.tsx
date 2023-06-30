import React, { useState, useContext } from "react";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import {
  Client,
  Databases,
  ID,
  Models,
  Query,
  Permission,
  Role,
  Teams,
} from "appwrite";

import { defaultImagePath, databaseId } from "../../utils/constants";
import {
  BucketNames,
  CollectionNames,
  Database,
  ModelNames,
} from "../../utils/models";
import { v4 as uuidv4 } from "uuid";

import { Meal, MealEnrichedWithCookingEvents } from "../../types/meals";
import styles from "./EditableRecipeCard.module.scss";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
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
  const { client, session } = useContext(AppWriteClientContext);

  const [title, setTitle] = useState(mealData?.name ?? "");
  const [description, setDescription] = useState(mealData?.description ?? "");
  const [recipeUrl, setRecipeUrl] = useState(mealData?.recipeUrl);
  const [mealImageUrl, setMealImageUrl] = useState(
    mealData?.imageUrl ?? defaultImagePath
  );

  if (!client) {
    return null;
  }
  const databases = new Databases(client);
  const teams = new Teams(client);

  if (!session) {
    return null;
  }
  const userId = session.userId;

  async function updateOrCreateMeal(mealData: Partial<Meal>) {
    try {
      let freshMealDataFromServer;
      if (mealData?.$id) {
        freshMealDataFromServer = await databases.updateDocument(
          databaseId,
          CollectionNames.MEALS,
          mealData.$id,
          {
            name: title,
            description: description,
            recipeUrl: recipeUrl,
            imageUrl: mealImageUrl,
          }
        );
      } else {
        const teamsList = await teams.list();
        const teamPermission = teamsList.teams.map((item) => [
          Permission.read(Role.team(item.$id)),
          Permission.update(Role.team(item.$id)),
          Permission.delete(Role.team(item.$id)),
        ]);

        freshMealDataFromServer = await databases.createDocument(
          databaseId,
          CollectionNames.MEALS,
          ID.unique(),
          {
            name: title,
            description: description,
            recipeUrl: recipeUrl,
            imageUrl: mealImageUrl,
            createdBy: userId,
          },
          [
            Permission.read(Role.user(userId)),
            ...teamPermission.flat(),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
          ]
        );
      }

      syncMealData(freshMealDataFromServer as MealEnrichedWithCookingEvents);
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
                      onUpload={(url: string) => {
                        if (setMealImageUrl) {
                          setMealImageUrl(url);
                        }
                      }}
                      bucketName={BucketNames.MEAL_IMAGES}
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
