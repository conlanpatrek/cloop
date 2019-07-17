var resolve = require('rollup-plugin-node-resolve')

export default {
  input: 'src/cloop.js',
  plugins: [resolve()],
  output: {
    file: 'dist/cloop.js',
    format: 'umd',
    name: 'cloop'
  }
}
