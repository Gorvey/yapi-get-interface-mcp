import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'cjs',
      bundle: true,
      dts: false,
      output: {
        target: 'node',
        filename: {
          js: 'index.cjs'
        }
      }
    }
  ],
  source: {
    entry: {
      index: './src/index.ts'
    }
  },
  output: {
    target: 'node',
    distPath: {
      root: './dist'
    }
  },
  tools: {
    bundlerChain: (chain: any) => {
      chain.externalsType('commonjs');
      chain.externals([
        ({ request }: any, callback: any) => {
          if (request && /^(assert|buffer|child_process|cluster|crypto|dgram|dns|domain|events|fs|http|https|net|os|path|punycode|querystring|readline|stream|string_decoder|timers|tls|tty|url|util|v8|vm|zlib|process)$/.test(request)) {
            return callback(undefined, `commonjs ${request}`);
          }
          callback();
        }
      ]);
    }
  }
}); 