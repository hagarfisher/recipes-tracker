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

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

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
