import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;
