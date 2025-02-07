import type { Config } from "tailwindcss";

export default {
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
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.175, 0.885, 0.32, 1)",
      },
      fontFamily: {
        geist: ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
