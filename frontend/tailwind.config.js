module.exports = {
  darkMode: "class", // <-- enable dark mode manually via class
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        pulseFast: "pulse 1s infinite",
      },
    },
  },
  plugins: [],
};
