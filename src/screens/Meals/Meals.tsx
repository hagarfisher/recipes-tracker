import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import EditableRecipeCard from "../../components/EditableRecipeCard/EditableRecipeCard";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import { MealEnrichedWithCookingEvents } from "../../types/meals";
import { Database, ModelNames } from "../../utils/models";
import styles from "./Meals.module.scss";

export default function Meals({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const [mealsData, setMealsData] = useState<MealEnrichedWithCookingEvents[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMealDataIndex, setCurrentMealDataIndex] = useState(0);

  const handleRecipeEdit = (mealDataIndex: number) => {
    let newMealData = { name: "my title" };
    if (mealDataIndex >= 0) {
      newMealData = mealsData[mealDataIndex];
    }
    setCurrentMealDataIndex(mealDataIndex);
    toggleDialogOpen();
  };
  const toggleDialogOpen = () => {
    setIsDialogOpen((prevState) => !prevState);
  };

  const user = useUser();

  useEffect(() => {
    getMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.access_token]);

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

  function syncMealData(updatedMealData: MealEnrichedWithCookingEvents) {
    setMealsData((prevState) => {
      if (currentMealDataIndex < 0) {
        return [...prevState, updatedMealData];
      }
      prevState[currentMealDataIndex] = updatedMealData;
      return prevState;
    });
  }

  async function deleteMeal(mealId: number) {
    try {
      setLoading(true);
      let { error } = await supabase
        .from(ModelNames.MEALS)
        .update({
          is_deleted: true,
          created_by: user!.id,
          updated_at: new Date(),
        })
        .eq("id", mealId);
      if (error) throw error;
      console.log("Meal deleted!");
      setMealsData((prevState) =>
        prevState.filter((item) => item.id != mealId)
      );
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
        onClick={() => handleRecipeEdit(-1)}
        variant="contained"
      >
        Add new meal
        <AddRoundedIcon />
      </Button>
      {mealsData.map((meal, index) => (
        <RecipeCard
          key={meal.id}
          mealData={meal}
          onCookingSessionEnd={() => updateCookingSession(meal.id)}
          handleDeleteMeal={() => deleteMeal(meal.id)}
          handleOpenDialog={() => handleRecipeEdit(index)}
        />
      ))}
      {isDialogOpen && (
        <EditableRecipeCard
          isOpen={isDialogOpen}
          handleClose={toggleDialogOpen}
          mealData={
            currentMealDataIndex >= 0
              ? mealsData[currentMealDataIndex]
              : undefined
          }
          syncMealData={syncMealData}
        />
      )}
    </div>
  );
}
