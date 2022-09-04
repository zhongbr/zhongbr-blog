/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 00:49:44
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 16:12:33
 */
import * as process from "process";
import {readJSON} from 'fs-extra';
import NpmPackage from "./pack/npm.js";

const packagesPath = process.argv[2];

const start = async (args?: string[]) => {
    const packages = args || (await readJSON(packagesPath));
    const tasks = packages.map(async packageInfo => {
        const [packageName, version] = packageInfo.split('@');
        const npm = new NpmPackage(packageName, version);

        await npm.init();
        await npm.install();
        await npm.build();
        return await npm.cpUmdFile();
    });

    return await Promise.all(tasks);
};

export default start;

