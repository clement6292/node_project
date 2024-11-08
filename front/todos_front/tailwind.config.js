/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'custom-background':"url('src/assets/images/bc78adf739744f80ea1310e6f6aba850.jpg')",
      },
    },
  },
  plugins: [],
}

