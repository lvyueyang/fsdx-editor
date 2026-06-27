import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  source: {
    entry: {
      index: './demo/index.tsx',
    },
  },
  html: {
    template: './demo/index.html',
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
