import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Rehype plugin to add lazy loading to images
function rehypeLazyImages() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://blog.dreamfold.dev',
  output: 'static',
  build: {
    format: 'directory'
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    rehypePlugins: [rehypeLazyImages]
  },
  vite: {
    build: {
      // Warn if chunks exceed 500KB
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        external: ['/pagefind/pagefind.js']
      }
    },
    plugins: [{
      name: 'pagefind-dev-alias',
      enforce: 'pre',
      resolveId(id) {
        if (id === '/pagefind/pagefind.js') {
          return { id, external: true };
        }
      }
    }]
  },
  integrations: [sitemap()]
});
