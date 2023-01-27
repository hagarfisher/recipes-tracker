import { Database, ModelNames } from "./../utils/models";

export enum MealEditMode {
  NEW = "new",
  UPDATE_EXISTING = "update",
}

export type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];
