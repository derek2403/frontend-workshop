/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '40': 'repeat(40, minmax(0, 1fr))',
      },
      fontFamily: {
        'fontdiner': ['"Fontdiner Swanky"', 'serif'],
      },
    },
  },
  plugins: [],
};
