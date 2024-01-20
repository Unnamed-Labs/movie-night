import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.tsx'],
  dts: true,
  external: ['react'],
  format: ['esm', 'cjs'],
  minify: true,
  ...options,
}));
