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
import styles from "./RecipeCard.module.scss";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import MaterialLink from "@mui/material/Link";
import Link from "next/link";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import CookieIcon from "@mui/icons-material/Cookie";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { isWithinLastDay } from "../../utils/date";
import EditDialog from "../EditDialog/EditDialog";
import { Router } from "express";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Picture from "../Picture/Picture";

interface Props {
  mealData: Partial<MealEnrichedWithCookingEvents>;
  handleOpenDialog?: () => void;
  onCookingSessionEnd?: MouseEventHandler<HTMLLabelElement>;
  linkToAdminPage?: string;
  withActions?: boolean;
  isEditMode?: boolean;
  setDescription?: (value: string) => void;
  setTitle?: (value: string) => void;
  setRecipeUrl?: (value: string) => void;
  setMealImageUrl?: (value: string) => void;
}

export default function RecipeCard({
  mealData,
  handleOpenDialog,
  onCookingSessionEnd,
  linkToAdminPage,
  withActions,
  isEditMode,
  setDescription,
  setTitle,
  setRecipeUrl,
  setMealImageUrl,
}: Props) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();

  const { imageUrl, isLoading, error } = useResolveImageUrl(
    CollectionNames.MEAL_IMAGES,
    mealData.image_url ?? defaultImagePath
  );

  // TODO: somehow deal with tags, display them etc.
  const hasThisRecipeBeenCookedToday = mealData.cooking_events?.find(
    (cookingEvent) => isWithinLastDay(new Date(cookingEvent.created_at))
  );
  return (
    <Card className={styles.card}>
      {!isLoading && !error && (
        <>
          {withActions && (
            <div className={styles["action-icons"]}>
              <IconButton
                color="primary"
                aria-label="edit"
                component="label"
                onClick={handleOpenDialog}
              >
                <ModeEditOutlinedIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="i-cooked-this"
                component="label"
                onClick={
                  hasThisRecipeBeenCookedToday ? undefined : onCookingSessionEnd
                }
              >
                {hasThisRecipeBeenCookedToday ? (
                  <CheckCircleOutlinedIcon />
                ) : (
                  <CookieIcon />
                )}
              </IconButton>
            </div>
          )}
          <div className={styles["edit-overlay"]}>
            <CardMedia
              className={styles["card-media"]}
              sx={{ height: 140 }}
              image={imageUrl}
              title="recipe-thumbnail"
            />
            {isEditMode && (
              <div className={styles["edit-icon"]}>
                <Picture
                  unique_id={uuidv4()}
                  url={mealData?.image_url ?? ""}
                  size={150}
                  onUpload={(url: string) => {
                    if (setMealImageUrl) {
                      setMealImageUrl(url);
                    }
                  }}
                  collectionName={CollectionNames.MEAL_IMAGES}
                  canEdit={true}
                />
              </div>
            )}
          </div>
        </>
      )}

      <CardContent className={styles["card-content"]}>
        {isEditMode ? (
          <TextField
            variant="standard"
            value={mealData.name}
            onChange={(event) => setTitle?.(event.target.value)}
            placeholder="Recipe title.."
          />
        ) : (
          <Tooltip title={mealData.name} placement="top-start">
            <Typography
              gutterBottom
              variant="h5"
              textTransform={"capitalize"}
              component="div"
              className={styles["card-title"]}
            >
              {mealData.name}
            </Typography>
          </Tooltip>
        )}

        {isEditMode ? (
          <TextField
            placeholder="Description.."
            variant="standard"
            value={mealData.description}
            multiline
            maxRows={5}
            onChange={(event) => setDescription?.(event.target.value)}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {mealData.description}
          </Typography>
        )}
        {isEditMode ? (
          <TextField
            variant="standard"
            value={mealData.recipe_url}
            onChange={(event) => setRecipeUrl?.(event.target.value)}
            placeholder="https://recipes-tracker.strafer.dev/"
          />
        ) : (
          <MaterialLink target={"_blank"} href={mealData.recipe_url ?? ""}>
            Recipe
          </MaterialLink>
        )}
      </CardContent>
    </Card>
  );
}
