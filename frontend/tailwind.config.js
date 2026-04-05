/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wise: {
          black: '#0e0f0c',
          green: '#9fe870',
          'green-dark': '#163300',
          'green-light': '#e2f6d5',
          'green-hover': '#cdffad',
          gray: '#868685',
          'gray-warm': '#454745',
          surface: '#e8ebe6',
          danger: '#d03238',
          warning: '#ffd11a',
          positive: '#054d28',
        },
      },
      fontFamily: {
        display: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'card-md': '16px',
        'card-lg': '12px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
