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

const { markdownFilesPath, markdownJsonPath, markdownCompileCachePath, compileCacheFile, catalogueFile, umdVersionFile } = require('../config/paths');

const usedUmdScripts = [];

/** traverse */
async function traverse(ast, listeners) {
    await listeners[ast.type]?.(ast);
    if (ast.children?.length) {
        for(const child of ast.children) {
            await traverse(child, listeners);
        }
    }
}

/** transform jsx code block */
async function transformJsx(ast) {
    const transformCode = (await import('../packages/jsx-core/dist/index.js')).default;
    const getVersion = (await import('../packages/umd-factory/distjs/pack/npm.js')).getVersion;
    await traverse(ast, {
        CodeBlock: async node => {
            const { lang, value } = node;
            if (lang === 'jsx') {
                const [code, imports, sources] = transformCode(value);
                node._js = code;
                node.imports = imports;
                node._sources = sources;
                node._umd = await Promise.all(imports.map(async imp => `${imp}@${await getVersion(imp)}`));
                console.log(node.imports, node._umd);
                usedUmdScripts.push(...node._umd || []);
            }
        }
    });
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
    const title = filename.replace(/\.md$/, '');
    const children = ast?.children || [];
    const ymlChild = children?.[0];

    const fileStat = await stat(path.join(markdownFilesPath, filename));

    if (ymlChild?.type === 'Yaml') {
        return new Promise((resolve) => {
            yaml.loadAll(ymlChild?.value, (doc) => {
                resolve({
                    title,
                    'json-path': `${title}.json`,
                    mdate: fileStat.mtime,
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
    console.log('load md2json', parse);
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

            // transform jsx code block
            await transformJsx(ast);

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
    // write umd file
    console.log('write file', umdVersionFile, usedUmdScripts);
    await write(umdVersionFile, JSON.stringify(usedUmdScripts));
    // child_process.execSync('pnpm run pack-umd ' + umdVersionFile);
}

startCompile().then();
