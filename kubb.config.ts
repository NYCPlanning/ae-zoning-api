import { defineConfig } from "@kubb/core";
import createSwagger from "@kubb/swagger";
import createSwaggerTS from "@kubb/swagger-ts";
import createSwaggerZod from "@kubb/swagger-zod";
import createSwaggerFaker from "@kubb/swagger-faker";

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
    createSwagger({ output: false }),
    createSwaggerZod({
      output: "./zod",
    }),
    createSwaggerTS({}),
    createSwaggerFaker({
      output: "./mocks",
    }),
  ],
});
