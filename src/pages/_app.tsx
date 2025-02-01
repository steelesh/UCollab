import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";
import BasicLayout from "@components/basic-layout";
import "@styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider defaultTheme="light">
      <Head>
        <meta name="description" content="For students, by students" />
        <link rel="icon" href="/favicon.ico" />
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
