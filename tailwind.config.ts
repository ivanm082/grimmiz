import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#7c5aa3",
          dark: "#6a4a8f",
          light: "#8d6bb3",
        },
        secondary: {
          DEFAULT: "#93c020",
          dark: "#7da01b",
          light: "#a3d326",
        },
        grimmiz: {
          text: "#2b2b2b",
          "text-secondary": "#555555",
        },
        // Aliases para facilitar el uso
        "grimmiz-text": "#2b2b2b",
        "grimmiz-text-secondary": "#555555",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;


