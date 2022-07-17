import { defineConfig } from "tsup";

export default defineConfig({
	format: ["esm", "cjs"],
	entry: ["src/index.ts"],
	splitting: true,
	sourcemap: true,
	clean: true,
	dts: true,
});
