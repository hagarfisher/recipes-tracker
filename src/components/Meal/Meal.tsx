import Link from "next/link";
import { CollectionNames, Database, ModelNames } from "../../utils/models";
import { navLinks, RouteNames } from "../../utils/routes";
import styles from "./Meal.module.scss";
import { MouseEventHandler } from "react";
import Picture from "../Picture/Picture";

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
  // TODO: somehow deal with tags, display them etc.
  return (
    <div className={styles.meal}>
      <span>{mealData.name}</span>
      <span>{mealData.description}</span>
      <span>{mealData.recipe_url}</span>
      {mealData.image_url && (
        <Picture
          url={mealData.image_url ?? ""}
          size={150}
          collectionName={CollectionNames.MEAL_IMAGES}
        />
      )}
      <Link
        href={{
          pathname: linkToAdminPage ?? "",
          query: { id: mealData.id },
        }}
      >
        Edit meal
      </Link>
      <button onClick={onCookingSessionEnd}>I've cooked this!</button>
    </div>
  );
}
