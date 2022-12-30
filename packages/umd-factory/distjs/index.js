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
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 00:49:44
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-05 22:28:54
 */
import * as process from "process";
import fse from 'fs-extra';
import NpmPackage from "./pack/npm.js";
import * as path from "path";
const packagesPath = process.argv[2] || path.resolve(process.cwd(), '../../.md-cache/umd-version.json');
const start = (args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('pack', packagesPath, process.argv);
    const packages = args || (fse.existsSync(packagesPath) ? yield fse.readJSON(packagesPath) : [packagesPath]);
    const tasks = packages.map((packageInfo) => __awaiter(void 0, void 0, void 0, function* () {
        const [packageName, version] = packageInfo.split('@');
        const npm = new NpmPackage(packageName, version);
        yield npm.init();
        yield npm.install();
        yield npm.generateEntry();
        yield npm.build();
        return yield npm.cpUmdFile();
    }));
    return yield Promise.all(tasks);
});
export default start;
