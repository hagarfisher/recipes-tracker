import { useContext } from "react";
import Auth from "../src/components/Authentication/Auth";
import { AppWriteClientContext } from "../src/contexts/AppWriteClientContext/AppWriteClientContext";
import styles from "../styles/pages.module.scss";
import Meals from "../src/screens/Meals/Meals";

const Home = () => {
  const { session } = useContext(AppWriteClientContext);

  return (
    <div className={styles.container}>
      {!session ? (
        <div className={styles["auth-container"]}>
          <Auth />
        </div>
      ) : (
        <Meals />
      )}
    </div>
  );
};

export default Home;
