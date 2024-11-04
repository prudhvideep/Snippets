/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "0.5/10" : "5%",
        "1/10" : "10%",
        "2/10" : "20%",
        "3/10" : "30%",
        "4/10" : "40%",
        "5/10" : "50%",
        "8/10" : "80%",
        "9/10" : "90%"
      },
      colors : {
        "graybg" : "#191919", 
        "lightgray" : "#9B9B9B",
        "drabg" : "#282A36",
      }
    },
  },
  plugins: [],
}

