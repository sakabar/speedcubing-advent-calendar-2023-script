const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const ss = require('simple-statistics')
const utils = require('../lib/utils');

const main = () => {
    const setting = yaml.load(fs.readFileSync('conf/setting.yaml', 'utf8'));
    const bufferStickerName = setting['bufferStickerName'];

    const scrambleObjs = fs.readFileSync('generated/scrambles.txt', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
            return utils.readScramble(line);
          });

    const prioritySettingObjs = fs.readFileSync('generated/prioritySettings.txt', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
              return utils.readPrioritySetting(line);
          });

    // Todo: ここの選び方もシミュレーションすべきか?
    // R,F,L,B,D,U
    const facePrioritySetting = [ 3, 2, 1, 4, 5, 0, ];

    for (const prioritySettingObj of prioritySettingObjs) {
        const {
            prioritySettingLabel,
            prioritySetting,
        } = prioritySettingObj;


        const tekazu_arr = [];
        for (const scrambleObj of scrambleObjs) {
            const {
                scrambleLabel,
                scrambledStickersInFaces,
            } = scrambleObj;

            const stickersToMemorize = utils.solve(bufferStickerName, prioritySetting, facePrioritySetting, scrambledStickersInFaces);
            tekazu_arr.push(stickersToMemorize.length);
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
