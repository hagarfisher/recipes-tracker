import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MealEditMode } from "../../types/meals";
import { CollectionNames, Database, ModelNames } from "../../utils/models";
import styles from "./MealEditing.module.scss";
import Picture from "../Picture/Picture";

import Box from "@mui/material/Box";
import MaterialLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useResolveImageUrl } from "../../hooks/useResolveImageUrl";
import { defaultImagePath } from "../../utils/constants";

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

  const { imageUrl, isLoading, error } = useResolveImageUrl(
    CollectionNames.MEAL_IMAGES,
    mealData?.image_url ?? defaultImagePath
  );
  const user = useUser();

  useEffect(() => {
    getMeal();
  }, [session]);

  // useEffect(() => {
  //   if (mealData) {
  //     updateOrCreateMeal(mealData);
  //   }
  // }, [mealData]);

  // if (!user) {
  //   return null;
  // }

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
      let { error } = await supabase.from(ModelNames.MEALS).upsert({
        ...mealPayload,
        created_by: user!.id,
        updated_at: new Date(),
      });
      if (error) throw error;
      const { data } = await supabase
        .from(ModelNames.MEALS)
        .select()
        .eq("name", mealPayload.name)
        .single();
      // if (data) {
      //   setMealData(data);
      // }
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
    <div className={styles["container"]}>
      <div className={styles["form-meal-edit"]}>
        <TextField
          label="Meal title"
          variant="standard"
          id="name"
          value={mealData?.name ?? ""}
          onChange={(e) => updateMeal("name", e.target.value)}
        />
        <TextField
          label="Recipe URL"
          variant="standard"
          id="recipe_url"
          value={mealData?.recipe_url ?? ""}
          onChange={(e) => updateMeal("recipe_url", e.target.value)}
        />
        <TextField
          label="Description"
          multiline
          maxRows={4}
          variant="standard"
          id="description"
          value={mealData?.description ?? ""}
          onChange={(e) => updateMeal("description", e.target.value)}
        />

        <Picture
          unique_id={uuidv4()}
          url={mealData?.image_url ?? ""}
          size={150}
          onUpload={(url: string) => {
            updateMeal("image_url", url);
            // updateOrCreateMeal({ ...mealData, image_url: url });
          }}
          collectionName={CollectionNames.MEAL_IMAGES}
          canEdit
        />

        <Button
          color="primary"
          variant="contained"
          onClick={() => mealData && updateOrCreateMeal(mealData)}
          disabled={loading}
        >
          {loading ? "Loading ..." : mealData?.id ? "Update" : "Create"}
        </Button>
        {mealData?.id && (
          <Button
            color="warning"
            variant="outlined"
            onClick={() => deleteMeal(mealData.id!)}
          >
            Delete
          </Button>
        )}
      </div>
      <div className={styles["card-preview"]}>
        <Card className={styles.card}>
          {!loading && (
            <CardMedia sx={{ height: 140 }} image={imageUrl} title="name" />
          )}

          <CardContent>
            <Typography
              className={styles["card-title"]}
              gutterBottom
              variant="h6"
              textTransform={"capitalize"}
              component="div"
            >
              {mealData?.name ?? "Title"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mealData?.description ?? "Description..."}
            </Typography>
            <MaterialLink target={"_blank"} href={mealData?.recipe_url ?? ""}>
              Recipe
            </MaterialLink>
          </CardContent>
          <CardActions>
            <Button size="small">i cooked this!</Button>
            <Button>Edit Meal</Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
