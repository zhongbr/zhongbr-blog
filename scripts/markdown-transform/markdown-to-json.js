function markdownToJson(markdown) {
    return new Promise(resolve => {
        import('md2json').then(({ parse }) => {
            resolve(parse(markdown));
        });
    });
}

module.exports = {
    markdownToJson
};
