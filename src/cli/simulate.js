const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const utils = require('../lib/utils');

const main = () => {
    const setting = yaml.load(fs.readFileSync('conf/setting.yaml', 'utf8'));
    const bufferStickerName = setting['bufferStickerName'];

    const scrambles = fs.readFileSync('generated/scrambles.txt', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
              return utils.readScramble(line);
          });

    const prioritySettings = fs.readFileSync('generated/prioritySettings.txt', 'utf8')
          .split('\n')
          .filter(s => s !== '')
          .map(line => {
              return utils.readPrioritySetting(line);
          });


    // Todo: ここの選び方もシミュレーションすべきか?
    // R,F,L,B,D,U
    const facePrioritySetting = [ 3, 2, 1, 4, 5, 0, ];

    for (const prioritySetting of prioritySettings) {
        for (const scramble of scrambles) {
            const stickersToMemorize = utils.solve(bufferStickerName, prioritySetting, facePrioritySetting, scramble);
            console.log(stickersToMemorize);
            // break;
        }
        // break;
    }


};

main()
