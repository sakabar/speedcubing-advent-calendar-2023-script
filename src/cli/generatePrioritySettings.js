const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const utils = require('../lib/utils');

const main = () => {
    const sampleSize = 400;

    const setting = yaml.load(fs.readFileSync('conf/setting.yaml', 'utf8'));
    const bufferStickerName = setting['bufferStickerName'];

    // 重複は排除する
    const prioritySettingStrSet = new Set();

    const flatten = _.flattenDeep(utils.solvedStickersInFaces);
    while (prioritySettingStrSet.size < sampleSize) {
        const prioritySetting = [
            [],
            [],
            [],
            [],
            [],
            [],
        ];

        const {
            faceInd: bufferFaceInd,
            stickerInd: bufferStickerInd,
        } = utils.findStickerIndOfSolved(bufferStickerName);

        for (let tmpFaceInd = 0; tmpFaceInd < utils.solvedStickersInFaces.length; tmpFaceInd++) {
            const stickersInFace = utils.solvedStickersInFaces[tmpFaceInd];

            if (tmpFaceInd === bufferFaceInd) {
                // バッファのある面の場合、バッファの優先順位は最後にする
                const priorityArr = _.shuffle([...stickersInFace].map((_,i)=>i).filter(i=>i !== bufferStickerInd));
                priorityArr.push(bufferStickerInd);

                prioritySetting[tmpFaceInd] = priorityArr;
            } else {
                // バッファがない面はランダム
                const priorityArr = _.shuffle([...stickersInFace].map((_,i)=>i));
                prioritySetting[tmpFaceInd] = priorityArr;
            }
        }

        const prioritySettingStr = prioritySetting.map(priorityArr => priorityArr.join(',')).join('_');
        prioritySettingStrSet.add(prioritySettingStr);
    }

    let cnt = 1;
    for (const prioritySettingStr of prioritySettingStrSet) {
        const msg = `rand_${String(cnt).padStart(4, '0')}\t${bufferStickerName}\t${prioritySettingStr}`;

        console.log(msg);
        cnt++;
    }
};

main();
