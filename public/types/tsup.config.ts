import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    splitting: false,
    sourcemap: true,
    // for the type maps to work, we use tsc's declaration-only command
    dts: false,
    clean: true,
    target: 'es6',
    esbuildOptions: (options, context) => {
        if (context.format === 'esm') {
            options.packages = 'external';
        }
    },
    entry: ['./index.ts']
});
