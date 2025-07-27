// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        alata: ['Alata', 'sans-serif'],
        grotesqueFit: ['GrotesqueFit', 'sans-serif'],
        grotesqueLarge: ['GrotesqueLarge', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
