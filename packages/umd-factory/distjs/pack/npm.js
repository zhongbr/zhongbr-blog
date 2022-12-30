var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
 * @Description: npm package class
 * @Author: 张盼宏
 * @Date: 2022-09-04 01:48:20
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-05 23:45:20
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
export function getVersion(name, version = 'latest') {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (version !== 'latest')
            return version;
        const res = yield fetch(`https://registry.npmjs.org/${name}`);
        const tarball = yield res.json();
        return ((_a = tarball === null || tarball === void 0 ? void 0 : tarball['dist-tags']) === null || _a === void 0 ? void 0 : _a['latest']) || '';
    });
}
class NpmPackage {
    constructor(name, version = 'latest') {
        this.name = name;
        this.version = version;
        this.resultPath = '';
        this.exist = false;
        this.tempPath = join(cwd, temp, `./${name}_${version}`);
        this.packageJsonPath = join(this.tempPath, './package.json');
        this.innerResultPath = join(this.tempPath, './dist/index.umd.js');
    }
    copy() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tempPath } = this;
            console.log('copy from', tempPath, ' to ', tempPath);
            yield fse.copy(template, tempPath);
        });
    }
    updatePackageJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, version, packageJsonPath } = this;
            const packageJson = yield fse.readJSON(packageJsonPath);
            packageJson.name = name;
            packageJson.dependencies = packageJson.dependencies || {};
            packageJson.dependencies['pack-target'] = `npm:${name}@${version}`;
            yield fse.writeJSON(packageJsonPath, packageJson);
        });
    }
    exec(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tempPath } = this;
            return new Promise((resolve, reject) => {
                exec(`cd ${tempPath} && ${command} && exit 0;`, (error, stdout, stderr) => {
                    if (stderr) {
                        reject(stderr);
                        return;
                    }
                    resolve(stdout);
                });
            }).catch(console.error);
        });
    }
    updateResultPath() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, version } = this;
            const v = yield getVersion(name, version);
            this.resultPath = join(distPath, `./${name}@${v}.umd.js`);
            this.exist = fse.existsSync(this.resultPath);
            return this.exist;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.copy();
            yield this.updatePackageJson();
            yield this.updateResultPath();
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exist) {
                return;
            }
            return yield this.exec('pnpm i');
        });
    }
    generateEntry() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const files = yield glob('/**/*.{js,ts,css,less,sass}', {
                root: packagePath,
                ignore: ['**/*.d.ts', '**/*.min.js']
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
                yield fse.remove(entry);
            }
            yield fse.writeFile(entry, defaultsImport + statements);
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.exist) {
                return;
            }
            return yield this.exec('pnpm run build');
        });
    }
    cpUmdFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const { resultPath, innerResultPath, tempPath, exist } = this;
            if (exist) {
                return resultPath;
            }
            yield fse.copyFile(innerResultPath, resultPath);
            yield fse.remove(tempPath);
            return resultPath;
        });
    }
}
export default NpmPackage;
