/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
import daisyUIThemes from "daisyui/src/theming/themes";
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],


  daisyui: {
    themes: [
      "light",
      // user-defined theme
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
          secondary: "rgb(24, 24, 24)",
        },
      },
    ],
  },
}