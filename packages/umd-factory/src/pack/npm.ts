/*
 * @Description: npm package class
 * @Author: 张盼宏
 * @Date: 2022-09-04 01:48:20
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-06 09:43:04
 */
import fse from 'fs-extra';
import { join } from 'path';
import * as process from "process";
import { exec } from 'child_process';
import fetch from 'node-fetch';
import _glob from 'glob';
import { promisify } from 'util';
import * as path from "path";
import { createHash } from 'crypto';

const glob = promisify(_glob);

const cwd = process.cwd();
const temp = './.temp';
const template = join(cwd, './umd-template');
const distPath = join(cwd, './dist');

if (!fse.existsSync(distPath)) {
    fse.mkdirSync(distPath);
}

export async function getVersion (name: string, version: string = 'latest') {
    if (version !== 'latest') return version;
    const res = await fetch(`https://registry.npmjs.org/${name}`);
    const tarball = await res.json() as any;

    return tarball?.['dist-tags']?.['latest'] || '';
}

class NpmPackage {
    private readonly tempPath: string;
    private packageJsonPath: string;
    public resultPath: string = '';
    private innerResultPath: string;
    private exist: boolean = false;

    constructor(public name: string, public version: string = 'latest') {
        this.tempPath = join(cwd, temp, `./${name}_${version}`);
        this.packageJsonPath = join(this.tempPath, './package.json');
        this.innerResultPath = join(this.tempPath, './dist/index.umd.js');
    }

    private async copy() {
        const { tempPath } = this;
        console.log('copy from', tempPath, ' to ', tempPath);
        await fse.copy(template, tempPath);
    }

    private async updatePackageJson() {
        const { name, version, packageJsonPath } = this;
        const packageJson = await fse.readJSON(packageJsonPath);

        packageJson.name = name;
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies['pack-target'] = `npm:${name}@${version}`;

        await fse.writeJSON(packageJsonPath, packageJson);
    }

    private async exec(command: string) {
        const { tempPath } = this;

        return new Promise<string>((resolve, reject) => {
            exec(`cd ${tempPath} && ${command} && exit 0;`,(error, stdout, stderr) => {
                if (stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout);
            });
        }).catch(console.error);
    }

    private async updateResultPath() {
        const { name, version } = this;

        const v = await getVersion(name, version);

        this.resultPath = join(distPath, `./${name}@${v}.umd.js`);
        this.exist = fse.existsSync(this.resultPath);

        return this.exist;
    }

    public async init() {
        await this.copy();
        await this.updatePackageJson();
        await this.updateResultPath();
    }

    public async install() {
        if (this.exist) {
            return;
        }
        return await this.exec('pnpm i');
    }

    public async generateEntry() {
        const packagePath = path.join(this.tempPath, './node_modules/pack-target');
        const defaultsImport = [
            `export * from 'pack-target';`,
            `import defaultTarget from 'pack-target';`,
            `export default defaultTarget;`,
            `const _subModules = {};`,
            `export const _import = path => {`,
                '\t' + `return _subModules[path] || _subModules[path + '/index'];`,
            `};`
        ].join('\n');

        const files = await glob('/**/*.{js,ts,css,less,sass}', {
            root: packagePath,
            ignore: ['**/*.d.ts', '**/*.min.js', '**/*.development.js', ]
        });

        const statements = files.map(file => {
            const md5 = createHash('md5');
            const hash = md5.update(file).digest('hex').slice(0, 5);
            const relative = path.relative(packagePath, file);

            return [
                `import default_${hash} from '${relative}';`,
                `import * as namespace_${hash} from '${relative}';`,
                `_subModules['${relative}'] = {`,
                    '\t' + `default: default_${hash},`,
                    '\t' + `...namespace_${hash}`,
                `};`
            ].join('\n');
        }).join('\n');

        const entry = path.join(this.tempPath, './src/index.js');
        if (fse.existsSync(entry)) {
            await fse.remove(entry);
        }
        await fse.writeFile(entry, defaultsImport + statements);
    }

    public async build() {
        if (this.exist) {
            return;
        }
        return await this.exec('pnpm run build');
    }

    public async cpUmdFile() {
        const { resultPath, innerResultPath, tempPath, exist } = this;
        if (exist) {
            return resultPath;
        }
        await fse.copyFile(innerResultPath, resultPath);
        await fse.remove(tempPath);

        return resultPath;
    }
}

export default NpmPackage;
