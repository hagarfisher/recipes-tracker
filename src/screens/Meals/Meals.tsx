import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import { Databases, ID, Permission, Role, Query } from "appwrite";
import { useContext, useEffect, useState } from "react";
import EditableRecipeCard from "../../components/EditableRecipeCard/EditableRecipeCard";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";
import { MealEnrichedWithCookingEvents } from "../../types/meals";
import { databaseId } from "../../utils/constants";
import { CollectionNames } from "../../utils/models";
import { sampleMeals } from "./sampleMeals";

import styles from "./Meals.module.scss";

export default function Meals() {
  const { client, session } = useContext(AppWriteClientContext);

  const [loading, setLoading] = useState(true);
  const [mealsData, setMealsData] = useState<MealEnrichedWithCookingEvents[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMealDataIndex, setCurrentMealDataIndex] = useState(0);
  useEffect(() => {
    getMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function createSampleData() {
      for (const meal of sampleMeals) {
        await databases.createDocument(
          databaseId,
          CollectionNames.MEALS,
          ID.unique(),
          { ...meal, createdBy: session!.userId },
          [
            Permission.read(Role.user(session!.userId)),
            Permission.update(Role.user(session!.userId)),
            Permission.delete(Role.user(session!.userId)),
          ]
        );
      }
    }
    if (
      loading === false &&
      mealsData.length === 0 &&
      session?.provider === "anonymous"
    ) {
      createSampleData().then(getMeals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealsData, loading]);

  if (!client) {
    return null;
  }

  const databases = new Databases(client);

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

  if (!session) {
    return null;
  }
  const userId = session.userId;

  async function getMeals() {
    try {
      setLoading(true);
      let { total = 0, documents = [] } = await databases.listDocuments(
        databaseId,
        CollectionNames.MEALS,
        [Query.equal("isDeleted", [false])]
      );

      if (documents) {
        const cookingEvents = await databases.listDocuments(
          databaseId,
          CollectionNames.COOKING_EVENTS,
          [Query.equal("createdBy", [userId])]
        );

        const enrichedMeals = documents.map((meal) => {
          const cookingEventsForThisMeal = cookingEvents.documents.filter(
            (cookingEvent) => cookingEvent.meal === meal.$id
          );
          return {
            ...meal,
            cookingEvents: cookingEventsForThisMeal,
          };
        }) as MealEnrichedWithCookingEvents[];
        setMealsData(enrichedMeals);
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

  async function deleteMeal(mealId: string) {
    try {
      setLoading(true);
      await databases.updateDocument(
        databaseId,
        CollectionNames.MEALS,
        mealId,
        {
          isDeleted: true,
        }
      );
      const cookingEventsToDelete = await databases.listDocuments(
        databaseId,
        CollectionNames.COOKING_EVENTS,
        [Query.equal("meal", [mealId])]
      );
      for (const cookingEvent of cookingEventsToDelete.documents) {
        await databases.updateDocument(
          databaseId,
          CollectionNames.COOKING_EVENTS,
          cookingEvent.$id,
          {
            isDeleted: true,
          }
        );
      }

      setMealsData((prevState) =>
        prevState.filter((item) => item.$id != mealId)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCookingSession(mealId: string) {
    try {
      const cookingEvent = await databases.createDocument(
        databaseId,
        CollectionNames.COOKING_EVENTS,
        ID.unique(),
        {
          meal: mealId,
          createdBy: userId,
          cookingDate: new Date(),
        },
        [
          Permission.read(Role.user(session!.userId)),
          Permission.update(Role.user(session!.userId)),
          Permission.delete(Role.user(session!.userId)),
        ]
      );

      await getMeals();
    } catch (error) {
      console.error(error);
    }
  }

  return loading ? (
    <div className={styles.loader}>
      <CircularProgress />
    </div>
  ) : (
    <div className={styles["meals-wrapper"]}>
      <Button
        color="secondary"
        onClick={() => handleRecipeEdit(-1)}
        variant="contained"
      >
        Add new meal
        <AddRoundedIcon />
      </Button>
      {mealsData.map((meal, index) => (
        <RecipeCard
          key={meal.$id}
          mealData={meal}
          onCookingSessionEnd={() => updateCookingSession(meal.$id)}
          handleDeleteMeal={() => deleteMeal(meal.$id)}
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
