import React from "react";
import { MouseEventHandler } from "react";
import { useResolveImageUrl } from "../../hooks/useResolveImageUrl";
import { defaultImagePath } from "../../utils/constants";
import { CollectionNames } from "../../utils/models";

import { Meal as MealType } from "../../types/meals";
import styles from "./RecipeCard.module.scss";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
} from "@mui/material";
import MaterialLink from "@mui/material/Link";
import Link from "next/link";

export default function RecipeCard({
  mealData,
  onCookingSessionEnd,
  linkToAdminPage,
}: {
  mealData: Partial<MealType>;
  onCookingSessionEnd?: MouseEventHandler<HTMLButtonElement>;
  linkToAdminPage?: string;
}) {
  //   const linkToAdminPage = navLinks.find(
  //     (link) => link.name === RouteNames.ADMIN
  //   )?.path;

  const { imageUrl, isLoading, error } = useResolveImageUrl(
    CollectionNames.MEAL_IMAGES,
    mealData?.image_url ?? defaultImagePath
  );
  // TODO: somehow deal with tags, display them etc.
  return (
    <Card className={styles.card}>
      {!isLoading && !error && (
        <CardMedia sx={{ height: 140 }} image={imageUrl} title="name" />
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
      <CardActions>
        <Button onClick={onCookingSessionEnd} size="small">
          i cooked this!
        </Button>
        <Button>
          <Link
            href={{
              pathname: linkToAdminPage ?? "",
              query: { id: mealData.id },
            }}
          >
            Edit meal
          </Link>
        </Button>
      </CardActions>
    </Card>
  );
}
