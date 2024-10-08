import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import preprocess from 'svelte-preprocess';
import { rollup } from 'rollup';

export default {
  input: 'src/main.js',  // Adjust according to your main entry file
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      preprocess: preprocess(),  // Use svelte-preprocess
      // Enable run-time checks when not in production
      dev: !process.env.NODE_ENV === 'production',
      // Extract CSS into a separate file
      css: css => {
        css.write('public/build/bundle.css');
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    // Include other plugins you may need
    terser()  // Minify the bundle
  ],
  watch: {
    clearScreen: false
  }
};
