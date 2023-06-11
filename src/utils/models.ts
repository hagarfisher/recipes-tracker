export enum ModelNames {
  PROFILES = "profiles",
  MEALS = "meals",
  COOKING_EVENTS = "cooking_events",
  TAGS = "tags",
}

export enum CollectionNames {
  MEALS = "6470b00824597c43a7a546be",
  TAGS = "6470b00824597c43a7a546bd",
  COOKING_EVENTS = "6470b00924597c43a7a546bf",
}

type Nullable<T> = null | T;

export type Database = {
  public: {
    Tables: {
      [ModelNames.PROFILES]: Record<
        "Row",
        {
          id: number;
          updated_at: Date;
          username: Nullable<string>;
          full_name: Nullable<string>;
          avatar_url: Nullable<string>;
          is_admin: Nullable<boolean>;
        }
      >;
      [ModelNames.MEALS]: Record<
        "Row",
        {
          id: number;
          created_at: Date;
          updated_at: Date;
          name: string;
          description: Nullable<string>;
          recipe_url: Nullable<string>;
          created_by: number;
          is_deleted: boolean;
          image_url: Nullable<string>;
        }
      >;
      [ModelNames.TAGS]: Record<
        "Row",
        {
          id: number;
          created_at: Date;
          updated_at: Date;
          label: string;
          is_deleted: boolean;
        }
      >;
      [ModelNames.COOKING_EVENTS]: Record<
        "Row",
        {
          id: number;
          created_at: Date;
          updated_at: Date;
          meal_id: number;
          created_by: number;
          is_deleted: boolean;
        }
      >;
    };
  };
};

export enum CollectionNames {
  AVATARS = "avatars",
  MEAL_IMAGES = "meal-images",
}

export enum BucketNames {
  MEAL_IMAGES = "646e5d99ec0488af389b",
}
