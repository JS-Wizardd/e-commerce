/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#fcfbf4',
        secondary: '#502a94',
        accent: '#fa5252',
      },
    },
  },
  plugins: [],
}
