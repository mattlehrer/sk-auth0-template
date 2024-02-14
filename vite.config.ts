import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import postcssCustomMedia from 'postcss-custom-media';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [postcssCustomMedia()]
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
