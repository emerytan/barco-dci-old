import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
	input: './src/app.js',
	output: {
		file: './build/bundle.js',
		format: 'iife'
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		resolve({
			browser: true
		}),
		commonjs()
	]
}
