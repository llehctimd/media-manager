import path from "path"
import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"
import { builtinModules } from "module"
const pkg = await import("./package.json", { with: { type: "json" } })

export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        target: "node22",
        outDir: "dist",
        lib: {
            entry: "src/main.ts",
            formats: ["es"],
        },
        rollupOptions: {
            external: (id: string) => {
                if (builtinModules.includes(id)) return true
                if (Object.keys(pkg.default.dependencies || {}).includes(id))
                    return true
                return false
            },
        },
    },
    test: {
        globals: true,
        environment: "node",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
