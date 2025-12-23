import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginZod } from "@kubb/plugin-zod";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig(() => {
  return {
    root: ".",
    input: {
      path: "./openapi/openapi.yaml",
    },
    output: {
      path: "./src/gen",
    },
    hooks: {
      done: ['prettier --write "./src/gen"', 'eslint "./src/gen" --fix'],
    },
    plugins: [
      pluginOas(),
      pluginZod({
        output: { path: "./zod" },
        coercion: false,
      }),
      pluginTs({
        output: { path: "./types" },
      }),
    ],
  };
});
