import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/dps": {
          target: env.VITE_API_TARGET || "http://localhost:9999",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
