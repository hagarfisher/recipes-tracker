import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Meals from "../src/screens/Meals/Meals";
import styles from "../styles/pages.module.scss";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className={styles.container}>
      {!session ? (
        <div className={styles["auth-container"]}>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              className: {
                container: styles["auth-component"],
                button: styles["auth-button"],
              },
            }}
            providers={["google"]}
            socialLayout="vertical"
          />
        </div>
      ) : (
        <Meals session={session} />
      )}
    </div>
  );
};

export default Home;
