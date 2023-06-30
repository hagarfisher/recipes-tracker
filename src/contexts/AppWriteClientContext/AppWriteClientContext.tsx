import { Account, Client, Models } from "appwrite";
import { createContext } from "react";
export const AppWriteClientContext = createContext<{
  account: Account | null;
  client: Client | null;
  session: Models.Session | null;
  setSession: React.Dispatch<React.SetStateAction<Models.Session | null>>;
  isLoading: boolean;
}>({
  account: null,
  client: null,
  session: null,
  setSession: () => {},
  isLoading: true,
});
