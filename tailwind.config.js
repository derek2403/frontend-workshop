/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          500: '#0074D9',
        },
        green: {
          500: '#2ECC40',
        },
        red: {
          500: '#FF4136',
        },
        yellow: {
          500: '#FFDC00',
        },
        purple: {
          500: '#B10DC9',
        },
      },
      gridTemplateColumns: {
        '40': 'repeat(40, minmax(0, 1fr))',
      },
      boxShadow: {
        'blue-500': '0 0 15px #0074D9',
        'green-500': '0 0 15px #2ECC40',
        'red-500': '0 0 15px #FF4136',
        'yellow-600': '0 0 20px #FFD700',
        'purple-500': '0 0 15px #B10DC9',
      },
    },
  },
  plugins: [],
};
