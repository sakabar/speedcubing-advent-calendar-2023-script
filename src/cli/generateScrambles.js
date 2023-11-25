const _ = require('lodash');
const utils = require('../lib/utils');

const main = () => {
    const loopCnt = 400;
    const msgs = [];

    // 重複は排除する
    const scrambleSet = new Set();

    const flatten = _.flattenDeep(utils.solvedStickersInFaces);
    while (scrambleSet.size < loopCnt) {
        const scrambledStickers = _.shuffle(flatten);

        const scramble = scrambledStickers.join(',');
        scrambleSet.add(scramble);
    }

    let cnt = 1;
    for (const scramble of scrambleSet) {
        const msg = `${String(cnt).padStart(4, '0')}\t${scramble}`;

        console.log(msg);
        cnt++;
    }
};

main();
