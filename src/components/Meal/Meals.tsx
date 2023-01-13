import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Database, ModelNames } from "../../utils/models";
import { RouteNames, navLinks } from "../../utils/routes";
import Meal from "./Meal";
import styles from "./Meal.module.scss";

type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];

export default function Meals({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const [mealsData, setMealsData] = useState<Meal[]>([]);
  const user = useUser();
  if (!user) {
    return null;
  }

  const linkToAdminPage = navLinks.find(
    (link) => link.name === RouteNames.ADMIN
  )?.path;

  useEffect(() => {
    getMeals();
  }, [session]);

  async function getMeals() {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from(ModelNames.MEALS)
        .select()
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
      setLoading(true);
      let { error } = await supabase.from(ModelNames.COOKING_EVENTS).insert({
        meal_id: mealId,
        created_by: user!.id,
      });
      if (error) {
        throw error;
      }
      console.log("Cooking session created!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <span>"Loading..."</span>
  ) : (
    <div className={styles["meals-wrapper"]}>
      <div className={styles["meal-list"]}>
        {mealsData.map((meal) => (
          <Meal
            mealData={meal}
            onCookingSessionEnd={() => updateCookingSession(meal.id)}
          />
        ))}
      </div>
      <Link
        href={{
          pathname: linkToAdminPage ?? "",
        }}
      >
        Add new meal recipe
      </Link>
    </div>
  );
}
