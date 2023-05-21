const { appendFile, readFile, writeFile } = require("fs/promises");
const { existsSync, mkdirSync } = require("fs");
const path = require("path");
const crypto = require('crypto');
const { pinyin } = require("pinyin");

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

function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

const encodedPaths = new Map();
function py(str) {
    const relative = path.parse(path.isAbsolute(str) ? path.relative(process.cwd(), str) : str);
    const paths = relative.dir.split(path.sep);
    paths.push(relative.name);
    return paths.map(segment => {
        if (encodedPaths.has(segment)) return encodedPaths.get(segment);
        let encoded = segment;
        if (/[^\w\-]/.test(segment)) {
            encoded = pinyin(segment, { style: pinyin.STYLE_NORMAL }).map(item => item[0]).join('-');
            encoded = encoded.replace(/[^\w\-]/g, '-');
            encoded = encoded.replace(/-+/g, '-');
        }
        encodedPaths.set(segment, encoded);
        return encoded;
    }).join(path.sep) + relative.ext;
}

module.exports = {
    readYaml,
    md5,
    write,
    ensurePath,
    py,
    encodedPaths
};
