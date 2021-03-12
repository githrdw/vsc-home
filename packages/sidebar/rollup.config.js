import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolve } from 'path'
import { terser } from "rollup-plugin-terser";
import htmlTemplate from 'rollup-plugin-generate-html-template';
import scss from "rollup-plugin-scss";

export default {
  input: 'src/index.js',
  treeshake: true,
  plugins: [
    htmlTemplate({
      template: 'src/index.html',
      target: 'index.html',
    }),
    nodeResolve(),
    scss({
      output: "./dist/sidebar-main.css",
      outputStyle: "compressed",
      failOnError: true,
      includePaths: [resolve('node_modules'), resolve('../../node_modules')],
    }),
    terser()
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