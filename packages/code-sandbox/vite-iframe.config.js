import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
    return {
        build: {
            sourcemap: true,
            manifest: true,
            lib: {
                entry: 'src/iframe/iframe.ts',
                name: 'iframe',
                fileName: 'iframe',
                formats: ['es']
            },
            outDir: './.cache/iframe',
            minify: 'terser',
            terserOptions: {
                compress: true,
                mangle: true
            },
            reportCompressedSize: false
        }
    };
});
