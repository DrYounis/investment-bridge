/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saudi: {
          blue: '#0057B7',
          gold: '#C49A2B',
          dark: '#1B3A5C',
          cream: '#F5F0E8',
        },
      },
      fontFamily: {
        arabic: ['Tajawal', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
