module.exports = {
  darkMode: "class", // <-- enable dark mode manually via class
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        pulseFast: "pulse 1s infinite",
      },
      colors: {
        gsuBlue: '#0039a6',
      },
      backgroundImage: {
        'gsu-gradient': 'linear-gradient(to bottom right, #e0f7ff, #f1f5f9)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
