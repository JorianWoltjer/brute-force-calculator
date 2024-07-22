import adapter from '@sveltejs/adapter-static';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // https://kit.svelte.dev/docs/adapter-static
    adapter: adapter()
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  }
};

export default config;
