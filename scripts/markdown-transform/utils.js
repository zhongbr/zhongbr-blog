const { appendFile, readFile, writeFile } = require("fs/promises");
const { existsSync, mkdirSync } = require("fs");
const path = require("path");

async function readYaml(content, path) {
    if (!content) {
        content = await readFile(path);
    }
    return new Promise((resolve) => {
        import("js-yaml").then((yaml) => {
            yaml.loadAll(content, doc => resolve(doc));
        })
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

function ensurePath(targetPath) {
    const subTargetPaths = (path.isAbsolute(targetPath) ? path.relative(process.cwd(), targetPath) : targetPath).split(path.sep);
    let dir = process.cwd();
    for (const subPath of subTargetPaths) {
        const curDir = path.join(dir, subPath);
        if (!existsSync(curDir)) {
            mkdirSync(curDir);
        }
        dir = curDir;
    }
}

module.exports = {
    readYaml,
    write,
    ensurePath
};
