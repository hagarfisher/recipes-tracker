import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import styles from "./Meal.module.scss";
import { Database, ModelNames } from "../../utils/models";
import Meal from "./Meal";
import Link from "next/link";
import { RouteNames, navLinks } from "../../utils/routes";
import { MealEditMode } from "../../types/meals";

type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];

export default function Meals({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const [mealsData, setMealsData] = useState<Meal[]>([]);

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
        .select();
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

  // async function updateMeal({
  //   username,
  //   avatar_url,
  // }: {
  //   username: Profiles["username"];
  //   avatar_url: Profiles["avatar_url"];
  // }) {
  //   try {
  //     setLoading(true);
  //     if (!user) throw new Error("No user");

  //     const updates = {
  //       id: user.id,
  //       username,
  //       avatar_url,
  //       updated_at: new Date().toISOString(),
  //     };

  //     let { error } = await supabase.from("profiles").upsert(updates);
  //     if (error) throw error;
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div className={styles["meals"]}>
      {mealsData.map((meal) => (
        <Meal mealData={meal} />
      ))}
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
