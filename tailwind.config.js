module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          'base-300': '#f8f8f8'
        }
      },
      // {
      //   dark: {
      //     ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
      //     'base-300': '#5e636e'
      //   }
      // },
    ],
  }
};
