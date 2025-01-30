import { SessionProvider } from "next-auth/react";
import { DevToolbar } from "../components/blocks/dev/dev-toolbar";
import Footer from "../components/blocks/footer/footer";
import Navbar from "../components/blocks/nav/navbar";
import { ThemeProvider } from "../components/blocks/theme-provider";
import { PostHogProvider } from "../components/posthog/posthog-provider";
import { Container } from "../components/ui/container";
import { Toaster } from "../components/ui/toaster";
import { TooltipProvider } from "../components/ui/tooltip";
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
                <main className="bg-background relative z-10 mt-10 mb-[-2rem] min-h-[100vh] flex-1 rounded-b-[2rem] py-16">
                  <Container>{children}</Container>
                  <Toaster />
                  <DevToolbar />
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
