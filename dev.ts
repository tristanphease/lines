import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";

const PORT: number = 8000;

const ctx = await esbuild.context({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/mod.ts"],
    outfile: "./dist/mod.js",
    sourcemap: true,
    bundle: true,
    format: "esm",
});

console.log(`serving on port ${PORT}`);
ctx.serve({
    port: PORT,
    servedir: "."
});