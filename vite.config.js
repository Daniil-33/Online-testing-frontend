import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vuetify({
			autoImport: true,
			// https://next.vuetifyjs.com/en/features/sass-variables/#component-specific-variables
			// styles: {
			// 	configFile: './src/assets/scss/styles.scss',
			// },
		}),
		topLevelAwait({
			// The export name of top-level await promise for each chunk module
			promiseExportName: "__tla",
			// The function to generate import names of top-level await promise in each chunk module
			promiseImportName: i => `__tla_${i}`
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	css: {
	//   preprocessorOptions: {
	//     scss: {
	//       additionalData: `@import "./src/assets/scss/variables.scss";`
	//     }
	//   }
	},
	server: {
		port: 8088,
	},
})
