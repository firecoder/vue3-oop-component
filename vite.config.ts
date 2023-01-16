import type { UserConfigExport } from "vite";

import * as path from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vuePlugin from "@firecoder-com/vite-plugin-vue-oop";


interface PackageJson {
    name: string,
    main?: string,
    module?: string,
    browser?: string,
    dependencies?: Record<string, string>,
    exports: {
        [key: string]: {
            "types": string,
            "import": string,
            "require"?: string,
            "browser"?: string,
            "default"?: string,
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("./package.json") as PackageJson;

// https://vitejs.dev/config/
export const BaseConfig: UserConfigExport = {
    plugins: [
        vuePlugin(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        minify: false,
        lib: {
            entry: {
                 [path.parse(
                     pkg.exports["."] && pkg.exports["."].import || path.parse(pkg.main).name
                 ).name]: "./src/index.ts",
                 "vue2-transition": "./src/vue2-transition.ts",
            },
            formats: ["es", "cjs"],
        },
        outDir: pkg.main ? path.basename(path.dirname(pkg.main)) || "lib" : "lib",
        rollupOptions: {
            external: [...Object.getOwnPropertyNames(pkg.dependencies), "tslib"],
        },
    },
};

export default defineConfig(BaseConfig);
