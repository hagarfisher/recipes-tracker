import { Database, ModelNames } from "./../utils/models";

export enum MealEditMode {
  NEW = "new",
  UPDATE_EXISTING = "update",
}

export type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];

export type MealEnrichedWithCookingEvents = Meal & {
  cooking_events: { id: number; created_at: string }[];
};
