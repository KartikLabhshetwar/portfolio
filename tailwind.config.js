/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Dark blue
        secondary: "#3B82F6", // Lighter blue
        accent: "#F59E0B", // Amber
        background: "#111827", // Very dark blue
        "text-light": "#F3F4F6", // Very light gray
        text: "#D1D5DB", // Light gray
      },
      animation: {
        "float-fast": "float 4s ease-in-out infinite",
        "pulse-fast": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "move-left-fast": "moveLeft 15s linear infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulse: {
          "0%, 100%": { opacity: 0.2 },
          "50%": { opacity: 0.5 },
        },
        moveLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
