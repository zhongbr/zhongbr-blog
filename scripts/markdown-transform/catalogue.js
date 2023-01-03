const path = require('path');

let catalogue;

async function init() {
    catalogue = {};
}

function attachPostMetas(metas, filePath) {
    const name = path.basename(filePath);
    catalogue[name] = metas;
}

function getCatalogue() {
    // 将索引按照 mdate 降序排列
    const entries = Object.entries(catalogue);
    entries.sort(([,meta1], [,meta2]) => {
        return new Date(meta2.mdate) - new Date(meta1.mdate);
    });
    return entries.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
}

module.exports = {
    init,
    attachPostMetas,
    getCatalogue
};
