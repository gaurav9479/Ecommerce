// tailwind.config.js (if using ESM)
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnightBlack: "#191528",
        darkPlum: "#3C162F",
        crimsonPlum: "#5C162E",
        cherryWine: "#7C162E",
        deepVoid: "#110E1B"
      }
    }
  },
  plugins: []
}
