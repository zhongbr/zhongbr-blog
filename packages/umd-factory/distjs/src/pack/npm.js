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
 * @LastEditTime: 2022-09-04 23:13:10
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, version } = this;
            let v = version;
            if (version === 'latest') {
                const res = yield fetch(`https://registry.npmjs.org/${name}`);
                const tarball = yield res.json();
                v = ((_a = tarball === null || tarball === void 0 ? void 0 : tarball['dist-tags']) === null || _a === void 0 ? void 0 : _a['latest']) || '';
            }
            this.resultPath = join(distPath, `./${name}@${v}.umd.js`);
            this.exist = fse.existsSync(this.resultPath);
            return this.exist;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('init');
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
