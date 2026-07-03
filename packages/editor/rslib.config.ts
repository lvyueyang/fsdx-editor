import { defineConfig } from '@rslib/core';

export default defineConfig({
  output: {
    target: 'web',
    injectStyles: true,
    cleanDistPath: false,
  },
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
    },
  ],
});
