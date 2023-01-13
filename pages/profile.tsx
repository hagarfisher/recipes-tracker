import { useSession } from "@supabase/auth-helpers-react";
import Account from "../src/components/Account/Account";

const Home = () => {
  const session = useSession();

  return (
    session && (
      <div className="container">
        <Account session={session} />
      </div>
    )
  );
};

export default Home;
