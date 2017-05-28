var resolve = require('rollup-plugin-node-resolve')

export default {
  entry: 'src/cloop.js',
  plugins: [resolve()],
  format: 'umd',
  moduleName: 'cloop',
  dest: 'dist/cloop.js'
}
