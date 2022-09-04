/*
 * @Description: npm package class
 * @Author: 张盼宏
 * @Date: 2022-09-04 01:48:20
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 14:54:11
 */
import fse from 'fs-extra';
import { join } from 'path';
import * as process from "process";
import { exec } from 'child_process';
import fetch from 'node-fetch';

const cwd = process.cwd();
const temp = './.temp';
const template = join(cwd, './umd-template');
const distPath = join(cwd, './dist');

if (!fse.existsSync(distPath)) {
    fse.mkdirSync(distPath);
}

class NpmPackage {
    private readonly tempPath: string;
    private packageJsonPath: string;
    private resultPath: string = '';
    private innerResultPath: string;
    private exist: boolean = false;

    constructor(public name: string, public version: string = 'latest') {
        this.tempPath = join(cwd, temp, `./${name}_${version}`);
        this.packageJsonPath = join(this.tempPath, './package.json');
        this.innerResultPath = join(this.tempPath, './dist/index.umd.js');
    }

    private async copy() {
        const { tempPath } = this;
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

        let v = version;

        if (version === 'latest') {
            const res = await fetch(`https://registry.npmjs.org/${name}`);
            const tarball = await res.json() as any;

            v = tarball?.['dist-tags']?.['latest'] || '';
        }

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
