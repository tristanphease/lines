import * as esbuild from "npm:esbuild@0.20.2";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.1";

const PORT: number = 8000;

const ctx = await esbuild.context({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/mod.ts"],
    outfile: "./dist/mod.js",
    bundle: true,
    format: "esm",
});

console.log(`serving on port ${PORT}`);
ctx.serve({
    port: PORT,
    servedir: "."
});