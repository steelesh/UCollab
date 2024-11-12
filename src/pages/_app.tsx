import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";
import BasicLayout from "@components/basic-layout";
import "@styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Head>
        <meta name="description" content="For students, by students" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="UCollab" />
      </Head>
      <SessionProvider>
        <BasicLayout>
          <Component {...pageProps} />
        </BasicLayout>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default MyApp;
