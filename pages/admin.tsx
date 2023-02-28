import { useSession } from "@supabase/auth-helpers-react";
import styles from "../styles/pages.module.scss";

const Admin = () => {
  const session = useSession();

  return session && <div className={styles.container}></div>;
};

export default Admin;
