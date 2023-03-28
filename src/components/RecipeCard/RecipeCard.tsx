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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { isWithinLastDay } from "../../utils/date";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Picture from "../Picture/Picture";

interface Props {
  mealData: Partial<MealEnrichedWithCookingEvents>;
  handleOpenDialog?: () => void;
  onCookingSessionEnd?: MouseEventHandler<HTMLLabelElement>;
  linkToAdminPage?: string;
  isEditMode?: boolean;
  setDescription?: (value: string) => void;
  setTitle?: (value: string) => void;
  setRecipeUrl?: (value: string) => void;
  setMealImageUrl?: (value: string) => void;
  handleDeleteMeal: () => void;
}

export default function RecipeCard({
  mealData,
  handleOpenDialog,
  onCookingSessionEnd,
  setDescription,
  setTitle,
  setRecipeUrl,
  setMealImageUrl,
  handleDeleteMeal,
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
            <IconButton
              color="primary"
              aria-label="delete"
              component="label"
              onClick={handleDeleteMeal}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </div>

          <div className={styles["edit-overlay"]}>
            <CardMedia
              className={styles["card-media"]}
              sx={{ height: 140 }}
              image={error ? defaultImagePath : imageUrl}
              title="recipe-thumbnail"
            />
          </div>
        </>
      )}

      <CardContent className={styles["card-content"]}>
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

        <Typography variant="body2" color="text.secondary">
          {mealData.description}
        </Typography>

        <MaterialLink target={"_blank"} href={mealData.recipe_url ?? ""}>
          Recipe
        </MaterialLink>
      </CardContent>
    </Card>
  );
}
