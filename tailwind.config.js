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
        'blue-500': '0 0 25px rgba(37,99,235,0.8)',
        'green-500': '0 0 25px rgba(22,163,74,0.8)',
        'red-500': '0 0 25px rgba(220,38,38,0.8)',
        'yellow-600': '0 0 25px rgba(234,179,8,0.8)',
        'purple-500': '0 0 25px rgba(147,51,234,0.8)',
      },
      backgroundColor: {
        'blue-600': '#2563eb',
        'green-600': '#16a34a',
        'red-600': '#dc2626',
        'yellow-500': '#eab308',
        'purple-600': '#9333ea',
      },
    },
  },
  plugins: [],
};
