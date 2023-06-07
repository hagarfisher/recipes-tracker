import { MouseEventHandler } from "react";
import { defaultImagePath } from "../../utils/constants";
import { CollectionNames, Database } from "../../utils/models";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CookieIcon from "@mui/icons-material/Cookie";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import MaterialLink from "@mui/material/Link";
import { MealEnrichedWithCookingEvents } from "../../types/meals";
import { isWithinLastDay } from "../../utils/date";
import styles from "./RecipeCard.module.scss";

interface Props {
  mealData: Partial<MealEnrichedWithCookingEvents>;
  handleOpenDialog?: () => void;
  onCookingSessionEnd?: MouseEventHandler<HTMLLabelElement>;
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
  // TODO: somehow deal with tags, display them etc.
  const hasThisRecipeBeenCookedToday = mealData.cookingEvents?.find(
    (cookingEvent) => isWithinLastDay(new Date(cookingEvent.cookingDate))
  );
  console.log(hasThisRecipeBeenCookedToday);
  return (
    <Card className={styles.card}>
      {
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
            <a href={mealData.recipeUrl ?? ""} target="_blank" rel="noreferrer">
              <CardMedia
                className={styles["card-media"]}
                sx={{ height: 140 }}
                image={mealData.imageUrl ?? defaultImagePath}
                title="recipe-thumbnail"
              ></CardMedia>
            </a>
          </div>
        </>
      }

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

        <MaterialLink target={"_blank"} href={mealData.recipeUrl ?? ""}>
          Recipe
        </MaterialLink>
      </CardContent>
    </Card>
  );
}
