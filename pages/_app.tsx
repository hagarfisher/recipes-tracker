import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Account, AppwriteException, Client, Models } from "appwrite";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import Header from "../src/components/Header/Header";
import { AppWriteClientContext } from "../src/contexts/AppWriteClientContext/AppWriteClientContext";
import { appTheme } from "../src/themes/theme";
import "../styles/globals.scss";

export default function App({
  Component,
  pageProps,
}: AppProps<Record<string, unknown>>) {
  const [session, setSession] = useState<Models.Session | null>(null);
  let client = null;
  let account: Account | null = null;
  if (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    console.error("NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set");
    // TODO: return error screen
    client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    account = new Account(client);
  }

  useEffect(() => {
    async function fetchUserSessionData() {
      console.log(account);
      if (!account || session) {
        return;
      }
      try {
        const session = await account.getSession("current");
        setSession(session);
      } catch (error) {
        if (!(error instanceof AppwriteException)) {
          console.error(error);
        }
      }
    }
    fetchUserSessionData();
  }, [account, session]);

  return (
    <AppWriteClientContext.Provider
      value={{ account, client, session, setSession }}
    >
      <ThemeProvider theme={appTheme}>
        <CssBaseline enableColorScheme />
        <Head>
          <meta name="theme-color" content="#3c1742" />
          <title>Recipes Tracker</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppWriteClientContext.Provider>
  );
}
