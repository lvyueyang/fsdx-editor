import { defineConfig } from '@rslib/core';

export default defineConfig({
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
    cleanDistPath: true,
  },
});
