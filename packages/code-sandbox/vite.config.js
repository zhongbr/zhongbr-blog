import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';

import serveConfig from './config/serve';

const cwd = process.cwd();

export default defineConfig(({ command }) => {
    const isServe = command === 'serve';
    return {
        resolve: {
            alias: {
                ...isServe ?
                    {
                        '@/iframe': path.resolve(cwd, 'src/iframe')
                    } : {
                        '@/iframe': path.resolve(cwd, '.cache/iframe')
                    },
            }
        },
        build: {
            sourcemap: true,
            manifest: true,
            lib: {
                entry: {
                    index: 'src/index.tsx',
                    webcomponent: 'src/webcomponent.tsx',
                    'plugins/babel/index': 'src/plugins/babel/index.ts',
                    'plugins/react/index': 'src/plugins/react/index.ts',
                    'plugins/resolve/index': 'src/plugins/resolve/index.ts',
                    'core/event/index': 'src/core/event/index.ts',
                    'core/proxy/index': 'src/core/proxy/index.ts',
                    'core/amd/index': 'src/core/amd/index.ts'
                },
                formats: ['es']
            },
            outDir: './es',
            minify: 'terser',
            terserOptions: {
                compress: true,
                mangle: true
            },
            rollupOptions: {
                external: ['react', 'react-dom'],
                output: {
                    globals: {
                        'react': 'React',
                        'react-dom': 'ReactDom'
                    }
                }
            },
            reportCompressedSize: false
        },
        plugins: [
            react(),
            dts()
        ],
        optimizeDeps: {
            entries: [
                'src/index'
            ]
        },
        worker: {
            rollupOptions: {
                output: {
                    compact: true
                }
            }
        },
        ... isServe && serveConfig
    };
});
