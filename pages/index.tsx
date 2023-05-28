import { useContext, useEffect, useState } from "react";
import { AppWriteClientContext } from "../src/contexts/AppWriteClientContext/AppWriteClientContext";
import styles from "../styles/pages.module.scss";
import { AppwriteException, Models } from "appwrite";
import { Sign } from "crypto";
import Auth from "../src/components/Authentication/Auth";

const Home = () => {
  const { account } = useContext(AppWriteClientContext);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  useEffect(() => {
    async function fetchUserSessionData() {
      if (!account) {
        return;
      }
      try {
        const user = await account.get();
        setUser(user);
      } catch (error) {
        if (!(error instanceof AppwriteException)) {
          console.error(error);
        }
      }
    }
    fetchUserSessionData();
  }, [account]);
  return (
    <div className={styles.container}>
      {!user ? (
        <div className={styles["auth-container"]}>
          <Auth />
        </div>
      ) : (
        // <Meals session={session} />
        <div>signed in</div>
      )}
    </div>
  );
};

export default Home;
