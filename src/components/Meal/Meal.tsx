import { Database, ModelNames } from "../../utils/models";

type Meal = Database["public"]["Tables"][ModelNames.MEALS]["Row"];

export default function Meal({ mealData }: { mealData: Meal }) {
  return <div key={mealData.id}>{JSON.stringify(mealData)}</div>;
}
