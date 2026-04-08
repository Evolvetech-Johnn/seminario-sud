import coreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...coreWebVitals,
  {
    files: ["src/hooks/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["eslint.config.mjs", "postcss.config.mjs"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
];
