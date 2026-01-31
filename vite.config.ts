import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  test: {
    globals: true,
    setupFiles: "./tests/setup.ts",
    environment: "jsdom",
    include: ["*/.{test,spec}.{js,ts,tsx,jsx}"],
  },
});
