import { SessionProvider } from "next-auth/react";
import Footer from "../components/blocks/footer/footer";
import Navbar from "../components/blocks/nav/navbar";
import { ThemeProvider } from "../components/blocks/theme-provider";
import { Container } from "../components/ui/container";
import { TooltipProvider } from "../components/ui/tooltip";
import { PostHogProvider } from "./(posthog)/posthog-provider";
import { hurricane, roboto, robotoMono, robotoSlab } from "./fonts";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${robotoSlab.variable} ${robotoMono.variable} ${roboto.variable} ${hurricane.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-background flex min-h-screen w-full flex-col antialiased">
        <SessionProvider>
          <PostHogProvider>
            <ThemeProvider>
              <TooltipProvider>
                <header className="bg-background sticky top-0 z-50">
                  <Navbar />
                </header>
                <main className="bg-background relative z-10 mb-[-2rem] min-h-[100vh] flex-1 rounded-b-[2rem] py-16">
                  <Container>{children}</Container>
                </main>
                <Footer />
              </TooltipProvider>
            </ThemeProvider>
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
