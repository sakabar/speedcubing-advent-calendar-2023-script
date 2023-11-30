const _ = require('lodash');
const utils = require('../lib/utils');

const main = () => {
    const sampleSize = 400;

    // 重複は排除する
    const scrambleSet = new Set();

    const flatten = _.flattenDeep(utils.solvedStickersInFaces);
    while (scrambleSet.size < sampleSize) {
        const scrambledStickers = _.shuffle(flatten);

        const scramble = scrambledStickers.join(',');
        scrambleSet.add(scramble);
    }

    let cnt = 1;
    for (const scramble of scrambleSet) {
        const msg = `rand_${String(cnt).padStart(4, '0')}\t${scramble}`;

        console.log(msg);
        cnt++;
    }
};

main();
