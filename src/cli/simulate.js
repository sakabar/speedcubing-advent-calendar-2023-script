const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const ss = require('simple-statistics')
const utils = require('../lib/utils');

const main = () => {
    const setting = yaml.load(fs.readFileSync('conf/setting.yaml', 'utf8'));
    const bufferStickerName = setting['bufferStickerName'];
    const minRegularPrioritySettingNo = setting['minRegularPrioritySettingNo'];
    const maxRegularPrioritySettingNo = setting['maxRegularPrioritySettingNo'];

    const sampledScrambleObjs = fs.readFileSync('generated/sampledScrambles.tsv', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
            return utils.readScramble(line);
          });

    const sampledPrioritySettingObjs = fs.readFileSync('generated/sampledPrioritySettings.tsv', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
              return utils.readPrioritySetting(line);
          });


    const generatedPrioritySettingObjs = utils.generateRegularPrioritySettings(bufferStickerName)
          .map((prioritySetting, ind) => {
              return {
                  prioritySettingLabel: `regular_${String(ind + 1).padStart(6, '0')}`,
                  prioritySetting,
              }
          });

    const prioritySettingObjs = sampledPrioritySettingObjs.concat(generatedPrioritySettingObjs);

    // Stickers => numberOfMoves(alg)
    const numberOfMovesDict = {};
    fs.readFileSync('conf/algorithms.tsv', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
              const {
                  stickers,
                  numberOfMoves,
              } = utils.readAlgorithm(line);

              numberOfMovesDict[stickers] = numberOfMoves;
          });

    // Todo: ここの選び方もシミュレーションすべきか?
    // R,F,L,B,D,U
    const facePrioritySetting = [ 3, 2, 1, 4, 5, 0, ];

    // const myPrioritySetting = [
    //     [ 1, 2, 3, 0 ],
    //     [ 1, 2, 3, 0 ],
    //     [ 1, 2, 3, 0 ],
    //     [ 1, 2, 3, 0 ],
    //     [ 1, 2, 3, 0 ],
    //     [ 1, 2, 3, 0 ],
    // ];

    const randomNumberOfMovesMeanArr = [];
    for (let prioritySettingObjInd=0; prioritySettingObjInd<prioritySettingObjs.length; prioritySettingObjInd++) {
        const prioritySettingObj = prioritySettingObjs[prioritySettingObjInd];
        const {
            prioritySettingLabel,
            prioritySetting,
        } = prioritySettingObj;

        if (prioritySettingObjInd < 400) {
            // ランダム400パターンは必ず計算する
        } else {
            // 規則的なパターン
            if (400 + minRegularPrioritySettingNo - 1 <= prioritySettingObjInd && prioritySettingObjInd <= 400 + maxRegularPrioritySettingNo - 1) {
                // 採用
                // } else if (String(prioritySetting) === String(myPrioritySetting)) {
                // 採用
            } else {
                continue;
            }
        }

        // console.log(prioritySetting);

        const numberOfMovesOfScrambleArr = [];
        for (const sampledScrambleObj of sampledScrambleObjs) {
            const {
                scrambleLabel,
                scrambledStickersInFaces,
            } = sampledScrambleObj;

            const stickersToMemorize = utils.solve(bufferStickerName, prioritySetting, facePrioritySetting, scrambledStickersInFaces);

            // 奇数文字の場合、バッファと同じ面の中で一番手数が少ないものを選ぶ
            if (stickersToMemorize.length % 2 === 1) {
                const lastStickerName = stickersToMemorize.slice(-1)[0];

                const {
                    faceInd: bufferFaceInd,
                    stickerInd: bufferStickerInd,
                } = utils.findStickerIndOfSolved(bufferStickerName);


                let longestAlgLength = 99;
                let parityStickerName;
                for (const bufferFaceSticker of utils.solvedStickersInFaces[bufferFaceInd]) {
                    if (bufferFaceSticker === bufferStickerName) {
                        continue;
                    }

                    const stickers = `${bufferStickerName} ${lastStickerName} ${bufferFaceSticker}`;
                    if (numberOfMovesDict[stickers] < longestAlgLength) {
                        longestAlgLength = numberOfMovesDict[stickers];
                        parityStickerName = bufferFaceSticker;
                    }
                }

                stickersToMemorize.push(parityStickerName);
            }


            let totalNumberOfMove = 0;
            _.chunk(stickersToMemorize, 2).map(pair => {
                const stickers = `${bufferStickerName} ${pair[0]} ${pair[1]}`;
                // console.log(stickers);
                // console.log(numberOfMovesDict[stickers]);
                if (!numberOfMovesDict[stickers]) {
                    console.log(bufferStickerName);
                    console.log(prioritySetting);
                    console.log(facePrioritySetting);
                    console.log(scrambledStickersInFaces);
                }
                totalNumberOfMove += numberOfMovesDict[stickers];
            });

            numberOfMovesOfScrambleArr.push(totalNumberOfMove);
        }

        const mean = ss.mean(numberOfMovesOfScrambleArr);
        const median = ss.median(numberOfMovesOfScrambleArr);
        const sd = ss.sampleStandardDeviation(numberOfMovesOfScrambleArr);

        if (prioritySettingLabel.indexOf('rand_') !== -1) {
            randomNumberOfMovesMeanArr.push(mean);
        }

        const msg = `prioritySetting_${prioritySettingLabel}\t${mean}\t${median}\t${sd}`;
        console.log(msg)
    }

    console.log(`mean of random priority: ${ss.mean(randomNumberOfMovesMeanArr)}`);
};

main()
