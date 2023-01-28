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
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      ) : (
        <Meals session={session} />
      )}
    </div>
  );
};

export default Home;
