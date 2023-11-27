const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const ss = require('simple-statistics')
const utils = require('../lib/utils');

const main = () => {
    const setting = yaml.load(fs.readFileSync('conf/setting.yaml', 'utf8'));
    const bufferStickerName = setting['bufferStickerName'];

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

    // Stickers => Alg
    const algDict = {};
    fs.readFileSync('conf/algorithms.tsv', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
              const {
                  stickers,
                  algorithm,
              } = utils.readAlgorithm(line);

              algDict[stickers] = algorithm;
          });

    // Todo: ここの選び方もシミュレーションすべきか?
    // R,F,L,B,D,U
    const facePrioritySetting = [ 3, 2, 1, 4, 5, 0, ];

    for (const sampledPrioritySettingObj of sampledPrioritySettingObjs) {
        const {
            prioritySettingLabel,
            prioritySetting,
        } = sampledPrioritySettingObj;


        const tekazu_arr = [];
        for (const sampledScrambleObj of sampledScrambleObjs) {
            const {
                scrambleLabel,
                scrambledStickersInFaces,
            } = sampledScrambleObj;

            const stickersToMemorize = utils.solve(bufferStickerName, prioritySetting, facePrioritySetting, scrambledStickersInFaces);

            // FIXME: 奇数文字の調整を最適化する
            if (stickersToMemorize.length % 2 === 1) {
                stickersToMemorize.push('Ufr');
            }

            let totalNumberOfMove = 0;
            _.chunk(stickersToMemorize, 2).map(pair => {
                const stickers = `${bufferStickerName} ${pair[0]} ${pair[1]}`;
                console.log(stickers);
                totalNumberOfMove += algDict[stickers].length;
            });

            tekazu_arr.push(totalNumberOfMove);
        }

        console.log(tekazu_arr);
        console.log(ss.mean(tekazu_arr));
        console.log(ss.median(tekazu_arr));
        console.log(ss.sampleStandardDeviation(tekazu_arr));
        // const msg = `prioritySetting_${prioritySettingLabel}\tscramble_${scrambleLabel}\t${stickersToMemorize.join(' ')}`;


        break;
    }


};

main()
