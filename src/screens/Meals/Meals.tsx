import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Database, ModelNames } from "../../utils/models";
import { RouteNames, navLinks } from "../../utils/routes";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import styles from "./Meals.module.scss";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CircularProgress } from "@mui/material";
import { MealEnrichedWithCookingEvents } from "../../types/meals";
import EditDialog from "../../components/EditDialog/EditDialog";
import EditableRecipeCard from "../../components/EditableRecipeCard/EditableRecipeCard";
export default function Meals({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const [mealsData, setMealsData] = useState<MealEnrichedWithCookingEvents[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMealDataIndex, setCurrentMealDataIndex] = useState(0);

  const handleRecipeEdit = (mealDataIndex: number) => {
    setCurrentMealDataIndex(mealDataIndex);
    toggleDialogOpen();
  };
  const toggleDialogOpen = () => {
    setIsDialogOpen((prevState) => !prevState);
  };

  const user = useUser();

  const linkToAdminPage = navLinks.find(
    (link) => link.name === RouteNames.ADMIN
  )?.path;

  useEffect(() => {
    getMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!user) {
    return null;
  }

  async function getMeals() {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from(ModelNames.MEALS)
        .select(`*, ${ModelNames.COOKING_EVENTS} (id, created_at)`)
        .eq("is_deleted", false);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setMealsData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCookingSession(mealId: number) {
    try {
      let { error } = await supabase.from(ModelNames.COOKING_EVENTS).insert({
        meal_id: mealId,
        created_by: user!.id,
      });
      if (error) {
        throw error;
      }
      await getMeals();
      console.log("Cooking session created!");
    } catch (error) {
      console.error(error);
    }
  }

  return loading ? (
    <CircularProgress />
  ) : (
    <div className={styles["meals-wrapper"]}>
      <Button
        className={styles["new-meal-btn"]}
        color="secondary"
        onClick={() => handleRecipeEdit(0)}
        variant="contained"
      >
        {/* <Link
          href={{
            pathname: linkToAdminPage ?? "",
          }}
        > */}
        Add new meal
        {/* </Link> */}
        <AddRoundedIcon />
      </Button>
      {mealsData.map((meal, index) => (
        <RecipeCard
          key={meal.id}
          mealData={meal}
          onCookingSessionEnd={() => updateCookingSession(meal.id)}
          linkToAdminPage={linkToAdminPage}
          withActions
          handleOpenDialog={() => handleRecipeEdit(index)}
        />
      ))}
      {isDialogOpen && (
        <EditableRecipeCard
          isOpen={isDialogOpen}
          handleClose={toggleDialogOpen}
          mealData={mealsData[currentMealDataIndex]}
          syncMealData={(updatedMealData) => {
            setMealsData((prevState) => {
              prevState[currentMealDataIndex] = updatedMealData;
              return prevState;
            });
          }}
        />
      )}
    </div>
  );
}
