import type { UserConfigExport } from "vite";

import * as path from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vuePlugin from "@firecoder-com/vite-plugin-vue-oop";
import { viteStaticCopy } from "vite-plugin-static-copy";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("./package.json") as { name: string, main: string, dependencies: Record<string, string> };

// https://vitejs.dev/config/
export const BaseConfig: UserConfigExport = {
    plugins: [
        vuePlugin(),
        viteStaticCopy({
            targets: [{
                src: "src/vue2-transition.{js,d.ts}",
                dest: "",
            }],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        minify: false,
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            // package name is in kebab-case, for the name of the browser global, we want camelCase
            name: pkg.name
                .replace(/-./g, ((w) => w[1].toUpperCase()))
                .replace(/^./, ((w) => w[0].toUpperCase()))
            ,
            fileName: () => path.basename(pkg.main),
            formats: ["es"],
        },
        rollupOptions: {
            external: [...Object.getOwnPropertyNames(pkg.dependencies), "tslib"],
        },
    },
};

export default defineConfig(BaseConfig);
