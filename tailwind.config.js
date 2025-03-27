/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(0, 208, 255)", // color-primary
        background: "rgb(21, 21, 21)", // color-background
        "background-contrast": "rgb(217, 217, 217)", // color-background-contrast
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // font-family-primary
      },
      fontSize: {
        h1: "74px", // font-size-h1
        h2: "38px", // font-size-h2
        h3: "34px", // font-size-h3
        h4: "28px", // font-size-h4
        h5: "24px", // font-size-h5
        h6: "22px", // font-size-h6
        body: "16px", // font-size-body
        caption: "12px", // font-size-caption
      },
      spacing: {
        normal: "16px", // padding-normal
        big: "24px", // padding-big
      },
      height: {
        header: "80px", // header-height
      },
      borderRadius: {
        normal: "4px", // border-radius-normal
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
