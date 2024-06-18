import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginZod } from "@kubb/swagger-zod";
import { pluginTs } from "@kubb/swagger-ts";

export default defineConfig({
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
    }),
    pluginTs({}),
  ],
});
