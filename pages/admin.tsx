import { useSession } from "@supabase/auth-helpers-react";
import MealEditing from "../src/screens/MealEditing/MealEditing";

const Admin = () => {
  const session = useSession();

  return (
    session && (
      <div className="container">
        <MealEditing session={session} />
      </div>
    )
  );
};

export default Admin;
