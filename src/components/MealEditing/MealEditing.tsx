import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MealEditMode } from "../../types/meals";
import { CollectionNames, Database, ModelNames } from "../../utils/models";
import styles from "./MealEditing.module.scss";
import Picture from "../Picture/Picture";

type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];

export default function MealEditing({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const { id } = router.query as {
    id?: number;
    mode?: MealEditMode;
  };
  const [loading, setLoading] = useState(true);
  const [mealData, setMealData] = useState<Partial<Meal>>();
  const user = useUser();
  console.log(user);
  if (!user) {
    return null;
  }

  useEffect(() => {
    getMeal();
  }, [session]);

  async function getMeal() {
    try {
      setLoading(true);
      if (!id) {
        return;
      }
      let { data, error, status } = await supabase
        .from(ModelNames.MEALS)
        .select()
        .eq("id", id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setMealData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrCreateMeal(mealPayload: Partial<Meal>) {
    try {
      setLoading(true);
      let { error } = await supabase
        .from(ModelNames.MEALS)
        .upsert({
          ...mealPayload,
          created_by: user!.id,
          updated_at: new Date(),
        })
        .single();
      if (error) throw error;
      const { data } = await supabase
        .from(ModelNames.MEALS)
        .select()
        .eq("name", mealPayload.name)
        .single();
      if (data) {
        setMealData(data);
      }
      console.log("Meal updated!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMeal(mealId: number) {
    try {
      setLoading(true);
      let { error } = await supabase.from(ModelNames.MEALS).update({
        id: mealId,
        is_deleted: true,
        created_by: user!.id,
        updated_at: new Date(),
      });
      if (error) throw error;
      console.log("Meal deleted!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function updateMeal(key: keyof Meal, valueToChange: Meal[keyof Meal]) {
    console.log({ [key]: valueToChange });
    setMealData((prevMealData) => ({
      ...(prevMealData ?? {}),
      [key]: valueToChange,
    }));
  }

  return (
    <div className={styles["form-meal-edit"]}>
      <div className={styles["form-input"]}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={mealData?.name ?? ""}
            onChange={(e) => updateMeal("name", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={mealData?.description ?? ""}
            onChange={(e) => updateMeal("description", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="recipe_url">Recipe URL</label>
          <input
            id="recipe_url"
            type="text"
            value={mealData?.recipe_url ?? ""}
            onChange={(e) => updateMeal("recipe_url", e.target.value)}
          />
        </div>
        {mealData?.id && (
          <Picture
            unique_id={mealData.id.toString()}
            url={mealData?.image_url ?? ""}
            size={150}
            onUpload={(url: string) => {
              updateMeal("image_url", url);
              updateOrCreateMeal({ image_url: url });
            }}
            collectionName={CollectionNames.MEAL_IMAGES}
          />
        )}
      </div>

      <div className={styles["form-input"]}>
        <button
          className="button primary block"
          onClick={() => mealData && updateOrCreateMeal(mealData)}
          disabled={loading}
        >
          {loading ? "Loading ..." : mealData?.id ? "Update" : "Create"}
        </button>
      </div>

      {mealData?.id && (
        <div className={styles["form-input"]}>
          <button
            className="button block"
            onClick={() => deleteMeal(mealData.id!)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
