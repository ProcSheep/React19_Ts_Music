import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

const resolve = (pathName: string) => path.resolve(__dirname, pathName)
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
})
