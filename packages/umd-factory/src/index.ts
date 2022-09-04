/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 00:49:44
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 02:37:44
 */
import * as process from "process";

import NpmPackage from "./pack/npm.js";

const [...packages] = process.argv.slice(2) as `${string}@${string}`[];

const start = async () => {
    const tasks = packages.map(async packageInfo => {
        const [packageName, version] = packageInfo.split('@');
        const npm = new NpmPackage(packageName, version);

        await npm.init();
        await npm.install();
        await npm.build();
        await npm.cpUmdFile();
    });

    await Promise.all(tasks);
};

start();
