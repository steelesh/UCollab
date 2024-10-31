import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        ucollab: {
          primary: "#E00122",
          "primary-focus": "#0056A6",
          "primary-content": "#FFFFFF",
          secondary: "#0056A6",
          "secondary-focus": "#004B91",
          "secondary-content": "#FFFFFF",
          accent: "#333333",
          "accent-focus": "#1A1A1A",
          "accent-content": "#FFFFFF",
          neutral: "#666666",
          "neutral-focus": "#4D4D4D",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#FAFAFA",
          "base-300": "#F5F5F5",
          "base-content": "#000000",
        },
      },
      {
        ucollabDark: {
          primary: "#E00122",
          "primary-focus": "#FF4D4D",
          "primary-content": "#FFFFFF",
          secondary: "#0056A6",
          "secondary-focus": "#3399FF",
          "secondary-content": "#FFFFFF",
          accent: "#CCCCCC",
          "accent-focus": "#E5E5E5",
          "accent-content": "#000000",
          neutral: "#999999",
          "neutral-focus": "#B3B3B3",
          "neutral-content": "#000000",
          "base-100": "#1A1A1A",
          "base-200": "#2A2A2A",
          "base-300": "#333333",
          "base-content": "#FFFFFF",
        },
      },
    ],
    darkTheme: "ucollabDark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
} satisfies Config;
