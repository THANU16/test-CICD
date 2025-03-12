import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#05E27E",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        larger: { min: "1600px" },
        tab: { min: "1024px", max: "1310px" },
        smaller: { min: "1px", max: "400px" },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(1deg)' },
          '75%': { transform: 'translateY(10px) rotate(-1deg)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;
