import React from "react";
import { MouseEventHandler } from "react";
import { useResolveImageUrl } from "../../hooks/useResolveImageUrl";
import { defaultImagePath } from "../../utils/constants";
import { CollectionNames } from "../../utils/models";

import {
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
} from "@mui/material";
import MaterialLink from "@mui/material/Link";
import Link from "next/link";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import CookieIcon from "@mui/icons-material/Cookie";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { isWithinLastDay } from "../../utils/date";
import EditDialog from "../EditDialog/EditDialog";

interface Props {
  mealData: Partial<MealEnrichedWithCookingEvents>;
  handleOpenDialog?: () => void;
  onCookingSessionEnd?: MouseEventHandler<HTMLLabelElement>;
  linkToAdminPage?: string;
  withActions?: boolean;
  isEditMode?: boolean;
}

export default function RecipeCard({
  mealData,
  handleOpenDialog,
  onCookingSessionEnd,
  linkToAdminPage,
  withActions,
  isEditMode,
}: Props) {
  const { imageUrl, isLoading, error } = useResolveImageUrl(
    CollectionNames.MEAL_IMAGES,
    mealData?.image_url ?? defaultImagePath
  );
  // TODO: somehow deal with tags, display them etc.
  console.log(mealData.cooking_events);
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
          <CardMedia
            sx={{ height: 140 }}
            image={imageUrl}
            title="recipe-thumbnail"
          />
        </>
      )}

      <CardContent className={styles["card-content"]}>
        <div style={{ display: "flex", gap: "0.5em", alignItems: "baseline" }}>
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
          {isEditMode && (
            <IconButton>
              <ModeEditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </div>

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
