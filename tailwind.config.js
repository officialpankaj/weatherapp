/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: ["12px", "16px"],
      sm: ["14px", "20px"],
      base: ["16px", "19.5px"],
      lg: ["18px", "21.94px"],
      xl: ["20px", "24.38px"],
      "1xl": ["30px", "34.38px"],
      "2xl": ["40px", "44.38px"],
      "4xl": ["60px", "64.38px"],
      "6xl": ["80px", "84.38px"],
      "8xl": ["100px", "104.38px"],
    },
    extend: {
      fontFamily: {
        mulish: ["Mulish", "sans-serif"],
      },
      colors: {
        primary: "#FBFAF4",
        secondary: "#E1F1F4",
        tertiary: "#6129EE",
        "slate-gray": "#6D6D6D",
        "white-900": "rgba(255, 255, 255, 0.90)",
        "white-800": "rgba(255, 255, 255, 0.80)",
        "white-700": "rgba(255, 255, 255, 0.70)",
        "white-600": "rgba(255, 255, 255, 0.60)",
        "white-500": "rgba(255, 255, 255, 0.50)",
        "white-400": "rgba(255, 255, 255, 0.40)",
        "white-300": "rgba(255, 255, 255, 0.30)",
      },
      boxShadow: {
        "3xl": "0 10px 40px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        hero: "url('assets/images/collection-background.svg')",
      },
      screens: {
        wide: "1440px",
      },
    },
  },
  plugins: [],
};