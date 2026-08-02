import fs from "fs";
import { build } from "esbuild";

async function runBuild() {
  try {
    // 1. Ensure dist directory exists
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist", { recursive: true });
    }

    // 2. Build TypeScript entrypoint with code splitting
    await build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      minify: true,
      sourcemap: true,
      format: "esm",
      splitting: true,
      outdir: "dist",
      loader: {
        ".json": "json"
      }
    });

    // 3. Copy index.html to dist/index.html
    fs.copyFileSync("src/index.html", "dist/index.html");

    console.log("Build completed successfully!");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

runBuild();
