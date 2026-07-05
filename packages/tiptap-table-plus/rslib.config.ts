import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginSass()],
  source: {
    entry: {
      index: ['./src/**'],
    },
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
      syntax: 'es2021',
    },
  ],
  output: {
    target: 'web',
    cleanDistPath: false,
  },
});
