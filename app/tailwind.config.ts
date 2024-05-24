import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM sans", "system-ui"],
      },
      colors: {
        primary1: "#2FE4AB",
        primary2: "#16968E",
        text1: "#D9EEF3",
        text2: "#9CC2C9",
        text3: "#475E64",
        background1: "#091011",
        background2: "#111F22",
        background3: "#182D32",
        background4: "#243D42",
        background5: "#2D4D53",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2FE4AB",
          secondary: "#16968E",
          accent: "#9CC2C9",
          neutral: "#D9EEF3",
          "base-100": "#111F22",
        },
      },
    ],
  },
  plugins: [daisyui],
};
export default config;
