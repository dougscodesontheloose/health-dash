/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ice: '#E8EDF3',
        space: '#0A0F18',
        tech: '#36C692',
        amber: '#D97706'
      }
    }
  },
  plugins: []
};
