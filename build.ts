import * as esbuild from "npm:esbuild@0.20.2";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.1";

await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/mod.ts"],
    outfile: "./dist/mod.js",
    bundle: true,
    minify: true,
    format: "esm",
});

esbuild.stop();