const glob = require('glob');
const { markdownFilesPath } = require('../../config/paths');

/**
 * 遍历存储 Markdown 的目录下的文件
 */
function traverse(cb) {
    return new Promise(resolve => {
        import('chalk').then(({ default: chalk }) => {
            glob(
                './**/*',
                {
                    cwd: markdownFilesPath,
                    nodir: true
                },
                (err, files) => {
                    if (err) {
                        console.log(chalk.red(err));
                        return;
                    }
                    Promise.all(files.map(file => {
                        console.log(chalk.green('attached file', file));
                        return cb(file);
                    })).then(resolve);
                }
            );
        });
    })
}

module.exports = {
    traverse
};
