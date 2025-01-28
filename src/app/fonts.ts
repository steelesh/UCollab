import { Hurricane, Roboto, Roboto_Mono, Roboto_Slab } from "next/font/google";

export const hurricane = Hurricane({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hurricane",
  weight: "400",
});

export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab",
});

export const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
