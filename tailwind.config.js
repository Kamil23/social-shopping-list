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
        "primary-blue": "#017FF3",
        "dark-blue": "#28537B",
        "medium-blue": "#2886DC",
        "light-blue": "#E8F4FF",
        "white-on-blue": "#F8FBFF",
        "light-gray": "#909fac33",
        "white-on-red": "#FFECE8",
        "primary-red": "#C50000",
        "primary-yellow": "#FFD52E",
      },
      fontFamily: {
        "anek-latin": ["Anek Latin", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        smoothShow: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
        typing: {
          "0%, 100%": { opacity: "10%" },
          "20%": { opacity: "100%" },
        },
      },
      animation: {
        smoothShow: "smoothShow 0.5s ease-in-out",
        dotsTyping: "typing 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
