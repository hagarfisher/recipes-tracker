import { Account, Client } from "appwrite";
import { createContext } from "react";
export const AppWriteClientContext = createContext<{
  account: Account | null;
  client: Client | null;
}>({ account: null, client: null });
