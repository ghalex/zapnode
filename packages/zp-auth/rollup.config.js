const path = require('path')
// const { config } = require('process')
const dts = require('rollup-plugin-dts').default
const esbuild = require('rollup-plugin-esbuild').default
const pkg = require('./package.json')

const name = pkg.name
// const projectRoot = path.resolve(__dirname, '.')

module.exports = [
  {
    input: 'src/index.ts',
    external: ['zapnode', 'config'],
    plugins: [
      esbuild()
    ],
    output: [
      {
        name: 'zapnode-auth',
        file: path.resolve(__dirname, `dist/${name}.umd.js`),
        format: 'umd',
        globals: {
          config: 'config',
          zapnode: 'zapnode'
        }
      },
      {
        file: path.resolve(__dirname, `dist/${name}.es.js`),
        format: 'es'
      }
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: path.resolve(__dirname, `dist/${name}.d.ts`),
      format: 'es'
    }
  }
]
