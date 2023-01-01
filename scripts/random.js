/**
 * 随机返回数组内的一个元素
 * @returns {*}
 */
Array.prototype.random = function () {
    this.sort(() => Math.random() > 0.5 ? -1 : 1);
    return this[Math.floor(Math.random() * Math.floor(Math.random() * 100) * this.length) % this.length];
}

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
        'https://i.328888.xyz/2023/01/01/tZMoa.jpeg',
        'https://i.328888.xyz/2023/01/01/tZLcw.jpeg',
        'https://i.328888.xyz/2023/01/01/tZTfx.jpeg',
        'https://i.328888.xyz/2023/01/01/tZa8k.jpeg',
        'https://i.328888.xyz/2023/01/01/tZ1FL.jpeg',
        'https://i.328888.xyz/2023/01/01/tZQYp.jpeg',
        'https://i.328888.xyz/2023/01/01/tZqwU.jpeg',
        'https://i.328888.xyz/2023/01/01/tZuxv.jpeg',
        'https://i.328888.xyz/2023/01/01/tiZM3.jpeg',
        'https://i.328888.xyz/2023/01/01/tiVty.jpeg',
        'https://i.328888.xyz/2023/01/01/tifc5.jpeg',
    ];
    return imagesPools.random();
}

// 随机生成一个 emoji 作为 icon
function randomEmojiIcon() {
    const emojiPools = [
        '🚀', '🔥', '🐒', '🐵', '🍀', '🎄', '🐳', '🦉', '🐞', '🐿', '🐰', '🍉', '🍋', '💊', '🐑',
        '🐮', '🍺', '💻', '📱', '☁️', '🌧', '❄️', '☀️', '🌛', '⭐️', '🌏', '🦁', '🐻', '🐭', '🐍',
    ];
    return emojiPools.random();
}

module.exports = {
    randomEmojiIcon,
    randomCoverImage
};
