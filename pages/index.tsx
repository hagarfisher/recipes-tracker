import { CircularProgress } from "@mui/material";
import { useContext } from "react";
import Auth from "../src/components/Authentication/Auth";
import { AppWriteClientContext } from "../src/contexts/AppWriteClientContext/AppWriteClientContext";
import Meals from "../src/screens/Meals/Meals";
import styles from "../styles/pages.module.scss";

const Home = () => {
  const { session, isLoading } = useContext(AppWriteClientContext);

  const renderContentOrAuth = () => {
    if (isLoading) {
      return (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      );
    }
    if (!session) {
      return (
        <div className={styles["auth-container"]}>
          <Auth />
        </div>
      );
    }
    return <Meals />;
  };

  return <div className={styles.container}>{renderContentOrAuth()}</div>;
};

export default Home;
