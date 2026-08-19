import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginSass()],
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
