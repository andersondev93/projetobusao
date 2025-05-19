/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056A4',
          dark: '#00458A',
          light: '#1976D2',
          lightest: '#E1F5FE',
        },
        secondary: {
          DEFAULT: '#FF9800',
          dark: '#F57C00',
          light: '#FFB74D',
        },
        'bg-neutral': '#FAFAFA',
        'card-bg': '#FFFFFF',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'border-color': '#E0E0E0',
        status: {
          success: '#4CAF50',
          warning: '#FFC107',
          error: '#F44336',
          info: '#2196F3',
        },
      },
    },
  },
  plugins: [],
};
