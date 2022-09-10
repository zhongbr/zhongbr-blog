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

const start = async (args?: string[]) => {
    console.log('pack', packagesPath, process.argv);
    const packages = args || (fse.existsSync(packagesPath) ? await fse.readJSON(packagesPath) : [packagesPath]);
    const tasks = packages.map(async packageInfo => {
        const [packageName, version] = packageInfo.split('@');
        const npm = new NpmPackage(packageName, version);

        await npm.init();
        await npm.install();
        await npm.generateEntry();
        await npm.build();
        return await npm.cpUmdFile();
    });

    return await Promise.all(tasks);
};

export default start;

