import { Database, ModelNames } from "./../utils/models";

export enum MealEditMode {
  NEW = "new",
  UPDATE_EXISTING = "update",
}

export type Meal = {
  name: string;
  description: null;
  imageUrl: string;
  recipeUrl: string;
  isDeleted: false;
  createdBy: string;
  tags: [];
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
};

export type MealEnrichedWithCookingEvents = Meal & {
  cookingEvents: {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    cookingDate: string;
    createdBy: string;
    isDeleted: boolean;
    meal: string;
  }[];
};
