import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

import serveConfig from './config/serve';

const target = process.env.TARGET;
const formats = process.env.FORMATS;
const fileName = process.env.FILE_NAME;
const out = process.env.OUT;

const cwd = process.cwd();

if (existsSync(out)) {
    await rm(out, { recursive: true });
}

export default defineConfig(({ command }) => {
    const isServe = command === 'serve';
    return {
        resolve: {
            alias: {
                ...isServe ?
                    {
                        '@/iframe': path.resolve(cwd, 'src/iframe')
                    } : {
                        '@/iframe': path.resolve(cwd, 'iframe')
                    },
            }
        },
        build: {
            sourcemap: true,
            manifest: true,
            lib: {
                entry: target,
                name: 'CodeSandbox',
                fileName,
                formats: formats.split(',')
            },
            outDir: out,
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
            }
        },
        plugins: [
            react()
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
