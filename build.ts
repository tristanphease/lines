import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";

await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/mod.ts"],
    outfile: "./dist/mod.js",
    bundle: true,
    minify: true,
    format: "esm",
});

esbuild.stop();