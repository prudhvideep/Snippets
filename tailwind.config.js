/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amber: {
          800: "#92400e",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        mona: ['"Mona Sans"', "sans-serif"],
      },
      height: {
        "0.5/10": "5%",
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
      },
      width: {
        "0.5/10": "5%",
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "8/10": "80%",
        "9/10": "90%",
      },
      colors: {
        graybg: "#191919",
        lightgray: "#9B9B9B",
        notearea: "#34374a",
        sidebar: "#21222c",
        h1: "#F8F8F2",
        h2: "#E9E9E9",
        h3: "#D1D1D1",
        blist: "#F8F8F2",
        tlist: "#F8F8F2",
        textcol: "#D1CFC9",
        floatfont : "#dbd781"
      },
    },
  },
  plugins: [],
  safelist: ["text-amber-800"],
};