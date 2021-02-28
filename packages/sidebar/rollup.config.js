import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolve } from 'path'
import typescript from '@rollup/plugin-typescript';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import scss from "rollup-plugin-scss";

export default {
  input: 'src/index.ts',
  treeshake: true,
  external: [],
  plugins: [
    htmlTemplate({
      template: 'src/index.html',
      target: 'index.html',
    }),
    scss({
      output: "./dist/sidebar-main.css",
      failOnError: true,
      includePaths: [resolve('node_modules'), resolve('../../node_modules')]
    }),
    typescript(),
    nodeResolve()
  ],
  watch: {
    include: "src/index.html"
  },
  output: {
    sourcemap: false,
    exports: 'named',
    file: 'dist/sidebar-main.js',
    format: 'es'
  }
}