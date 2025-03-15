// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"], // Add paths to all your template files
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hoverColor: "#FFC000",
        brightColor: "#dd8036",
        backgroundColor: "#36ae9a",
      },
    },
  },
  plugins: [],
};
