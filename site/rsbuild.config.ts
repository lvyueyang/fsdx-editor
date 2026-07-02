import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  html: {
    template: './index.html',
  },
  output: {
    distPath: {
      root: 'dist',
    },
    assetPrefix: '/fsdx-editor/',
  },
  server: {
    base: '/fsdx-editor/',
  },
  resolve: {
    alias: {
      '@fsdx/editor$': path.resolve(
        __dirname,
        '../packages/editor/src/index.ts',
      ),
      '@fsdx/editor/editor.css': path.resolve(
        __dirname,
        '../packages/editor/src/editor.css',
      ),
    },
  },
  plugins: [
    pluginReact(),
    pluginSass(),
    pluginBabel({
      include: /\.[jt]sx?$/,
      exclude: [/[\\/]node_modules[\\/]/],
      babelLoaderOptions(opts) {
        opts.plugins ??= [];
        opts.plugins.unshift('babel-plugin-react-compiler');
      },
    }),
  ],
});
