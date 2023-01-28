import { useSession } from "@supabase/auth-helpers-react";
import MealEditing from "../src/screens/MealEditing/MealEditing";
import styles from "../styles/pages.module.scss";

const Admin = () => {
  const session = useSession();

  return (
    session && (
      <div className={styles.container}>
        <MealEditing session={session} />
      </div>
    )
  );
};

export default Admin;
