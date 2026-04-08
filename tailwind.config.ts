import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sud: {
          navy: "#1E3A8A",
          blue: "#2563EB",
          white: "#FFFFFF",
          gray: "#F3F4F6",
          green: "#059669",
        },
      },
      boxShadow: {
        "soft-lg": "0 20px 45px rgba(15, 23, 42, 0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;

