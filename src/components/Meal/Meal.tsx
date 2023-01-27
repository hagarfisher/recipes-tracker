import Link from "next/link";
import { MouseEventHandler } from "react";
import { CollectionNames, Database, ModelNames } from "../../utils/models";
import { navLinks, RouteNames } from "../../utils/routes";
import styles from "./Meal.module.scss";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import MaterialLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useResolveImageUrl } from "../../hooks/useResolveImageUrl";
import { defaultImagePath } from "../../utils/constants";

type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];

export default function Meal({
  mealData,
  onCookingSessionEnd,
}: {
  mealData: Meal;
  onCookingSessionEnd: MouseEventHandler<HTMLButtonElement>;
}) {
  const linkToAdminPage = navLinks.find(
    (link) => link.name === RouteNames.ADMIN
  )?.path;

  const { imageUrl, isLoading, error } = useResolveImageUrl(
    CollectionNames.MEAL_IMAGES,
    mealData.image_url ?? defaultImagePath
  );
  // TODO: somehow deal with tags, display them etc.
  return (
    <Card className={styles.card}>
      {!isLoading && !error && (
        <CardMedia sx={{ height: 140 }} image={imageUrl} title="name" />
      )}

      <CardContent className={styles["card-content"]}>
        <Typography
          gutterBottom
          variant="h5"
          textTransform={"capitalize"}
          component="div"
          sx={{ "overflow-wrap": "break-word" }}
        >
          {mealData.name}
        </Typography>
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
