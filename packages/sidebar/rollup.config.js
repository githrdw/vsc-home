import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolve } from 'path'
import { terser } from "rollup-plugin-terser";
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
      outputStyle: "compressed",
      failOnError: true,
      includePaths: [resolve('node_modules'), resolve('../../node_modules')],
    }),
    nodeResolve(),
    // Remove IBM Carbon styles from bundle, components will share styling to reduce bundle size
    {
      name: 'replace',
      renderChunk(code) {
        let match
        const pattern = new RegExp(/ = css\(\[\n.+\n]\);/, 'gm')
        while ((match = pattern.exec(code))) {
          const str = match[0]
          if (str) {
            const start = match.index;
            const end = start + str.length;
            code = code.substr(0, start) + code.substr(end)
          }
        }
        return { code };
      }
    },
    typescript(),
    // terser()
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