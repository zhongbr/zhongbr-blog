/*
 * @Description: compile markdown to json
 * @Author: 张盼宏
 * @Date: 2022-08-28 11:26:36
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-08 23:31:27
 */
const chalk = require('react-dev-utils/chalk');
const path = require('path');
const { existsSync } = require('fs');
const { readFile, readdir, appendFile, writeFile, mkdir, stat } = require('fs/promises');
const crypto = require('crypto');
const yaml = require('js-yaml');

const { markdownFilesPath, markdownJsonPath, markdownCompileCachePath, compileCacheFile, catalogueFile } = require('../config/paths');

// 随机生成一张封面图片
function randomCoverImage() {
    const imagesPools = [
        'https://i.328888.xyz/2022/12/31/ndOVF.jpeg',
        'https://i.328888.xyz/2022/12/31/nd2oZ.jpeg',
        'https://i.328888.xyz/2022/12/31/ndbjH.jpeg',
        'https://i.328888.xyz/2022/12/31/ndj6Q.jpeg',
        'https://i.328888.xyz/2022/12/31/nd8QE.jpeg',
        'https://i.328888.xyz/2022/12/31/ndNlC.jpeg',
        'https://i.328888.xyz/2022/12/31/ndrgP.jpeg',
        'https://i.328888.xyz/2022/12/31/nd3LX.jpeg',
        'https://i.328888.xyz/2022/12/31/ndcnt.jpeg',
        'https://i.328888.xyz/2022/12/31/ndmRJ.jpeg',
        'https://i.328888.xyz/2022/12/31/ndpoc.jpeg',
    ];
    return imagesPools[Math.floor(Math.random() * 10 * imagesPools.length) % imagesPools.length];
}

/** traverse */
async function traverse(ast, listeners) {
    await listeners[ast.type]?.(ast);
    if (ast.children?.length) {
        for(const child of ast.children) {
            await traverse(child, listeners);
        }
    }
}

/** write files */
async function write(target, content) {
    if (!existsSync(target)) {
        console.log('append', target);
        return appendFile(target, content);
    }
    return writeFile(target, content);
}

/** catalogue */
async function generateCatalogue(filename, ast) {
    const date = filename.match(/20(?:-?\d{2}){3}/)?.[0];
    const title = filename.replace(/\.md$/, '').replace(/20(\d{2}-){3}/, '');
    const children = ast?.children || [];
    const ymlChild = children?.[0];

    const fileStat = await stat(path.join(markdownFilesPath, filename));

    if (ymlChild?.type === 'Yaml') {
        return new Promise((resolve) => {
            yaml.loadAll(ymlChild?.value, (doc) => {
                resolve({
                    title,
                    'json-path': `${date}-${title}.json`,
                    mdate: date,
                    cover: randomCoverImage(),
                    ...doc
                });
            });
        });
    }

    return Promise.resolve({
        title,
    });
}

async function startCompile() {
    // import parser
    const { parse } = await import('md2json');
    console.log('load md2json 🚀', parse);
    // check dir exist
    for (const path1 of [markdownFilesPath, markdownJsonPath, markdownCompileCachePath]) {
        if (!existsSync(path1)) {
            console.log(chalk.yellow(`mkdir ${path1}`))
            await mkdir(path1);
        }
    }

    // load compile hash in cache
    let compileHash = {};
    if (existsSync(compileCacheFile)) {
        const jsonBuffer = await readFile(compileCacheFile);
        compileHash = JSON.parse(jsonBuffer.toString());
    }

    // load catalogue
    let catalogue = {};
    if (existsSync(catalogueFile)) {
        const jsonBuffer = await readFile(catalogueFile);
        catalogue = JSON.parse(jsonBuffer.toString());
    }

    // start compile markdown files
    const files = await readdir(markdownFilesPath);
    for (const file of files) {
        const jsonName = file.replace(/\.md$/, '.json');
        console.log(chalk.blue(`attach file: ${file}`));

        const sourcePath = path.join(markdownFilesPath, file);
        const targetPath = path.join(markdownJsonPath, jsonName);

        const buffer = await readFile(sourcePath);

        const md5 = crypto.createHash('md5');
        const hash = md5.update(buffer).digest('hex');

        // not compile yet or updated, start compile
        if (!compileHash?.[file] || compileHash[file] !== hash) {
            const ast = parse(buffer.toString());

            const metas = await generateCatalogue(file, ast);

            if (metas?.editing) {
                continue;
            }

            catalogue[file] = metas;
            await write(targetPath, JSON.stringify({
                ast,
                catalogue: catalogue[file]
            }));

            console.log(chalk.green(`${file} compiled to ${jsonName}`));
            compileHash[file] = hash;
        }
        else {
            console.log(chalk.green(`${file} didn't change since last compile, use cached.`));
        }

        // update hash file
        await write(compileCacheFile, JSON.stringify(compileHash));
        await write(catalogueFile, JSON.stringify(catalogue));
    }
}

startCompile().then();
