import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";
import "../styles/globals.scss";
import Head from "next/head";
import Header from "../src/components/Header/Header";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appTheme } from "../src/themes/theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Client, Account } from "appwrite";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  if (process.env.APPWRITE_PROJECT_ID) {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.APPWRITE_PROJECT_ID);
  } else {
    console.error("APPWRITE_PROJECT_ID is not set");
  }

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
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
    </SessionContextProvider>
  );
}
