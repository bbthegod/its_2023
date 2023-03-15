const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
  content: [
    'apps/client/src/**/*.{js,jsx,ts,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      background: "#1f1f1f",
      primary: "#ff9800"
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        lofi: {
          ...require("daisyui/src/colors/themes")["[data-theme=lofi]"],
          success: "#ff9800",
        },
      },
    ],
  },
};