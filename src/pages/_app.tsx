import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";
import BasicLayout from "@components/basic-layout";

import "@styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Head>
        <meta name="description" content="For students, by students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </ThemeProvider>
  );
};

export default MyApp;
