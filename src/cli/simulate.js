const _ = require('lodash');
const utils = require('../lib/utils');

const main = () => {
    // ここは前提として入力する
    const bufferStickerName = 'Ubl';
    const msgs = [];
    let uFaceFulfilledCnt = 0;

    const {
        faceInd: bufferFaceInd,
        stickerInd: bufferStickerInd,
    } = utils.findStickerIndOfSolved(bufferStickerName);
    // console.log(`utils.solvedStickersInFaces[${bufferFaceInd}][${bufferStickerInd}] = ${utils.solvedStickersInFaces[bufferFaceInd][bufferStickerInd]}`);

    // 4*10^6個のスクランブルに対して、約1分かかる
    const loopCnt = 4 * 1000 * 10;
    const flatten = _.flattenDeep(utils.solvedStickersInFaces);
    for (let i = 0; i < loopCnt; i++) {
    const scrambledStickersInFaces = _.chunk(_.shuffle(flatten), 4);

    // console.log('solved = ');
    // console.log(utils.solvedStickersInFaces);

    // console.log('scrambled = ');
    // console.log(scrambledStickersInFaces);
    // console.log('');


    // FIXME 暫定
    // priorityの中身はstickerInd
    const priority = [
        [ 3, 0, 1, 2, ],
        [ 0, 1, 2, 3, ],
        [ 0, 1, 2, 3, ],
        [ 0, 1, 2, 3, ],
        [ 0, 1, 2, 3, ],
        [ 0, 1, 2, 3, ],
    ];

    // これやると速くなるかも?
    // const priorityCursors = [ 0, 0, 0, 0, 0, 0, ];

    // console.log('priority');
    // console.log(priority);
    // console.log('');

    // まず、bufferFaceIndとbufferStickerIndを見る
    let stickerAtBuffer = scrambledStickersInFaces[bufferFaceInd][bufferStickerInd];
    const stickersToMemorize = [];

    while (!utils.isSolved(scrambledStickersInFaces)) {
        // そのステッカーが本来入るべきステッカーの面の中で、まだ埋まっていない面をpriorityに従って見る
        let {
            faceInd: faceIndAtTarget,
            stickerInd: strictStickerIndAtTarget,
        } = utils.findStickerIndOfSolved(stickerAtBuffer);


        let stickerIndAtTarget = null;
        const priorityInFace = priority[faceIndAtTarget];
        // console.log(priorityInFace);

        for (const priorityStickerInd of priorityInFace) {
            const priorityStickerName = utils.solvedStickersInFaces[faceIndAtTarget][priorityStickerInd];

            // そのステッカーはもう正しく埋まっているか?
            if (scrambledStickersInFaces[faceIndAtTarget][priorityStickerInd][0] !== priorityStickerName[0]) {
                stickerIndAtTarget = priorityStickerInd;

                break;
            }
        }

        // 白面が全て埋まっていた場合にはstickerIndAtTargetがnullとなる
        if (stickerIndAtTarget === null) {
            // console.log('U Face is fulfilled');

            // 正しく埋まっていないステッカーを1つ選び、入れ換える
            // Todo: ここの選び方もシミュレーションすべきか?
            const facePriority = [ 5, 0, 1, 3, 2, 4, ];
            for (const tmpFaceInd of facePriority) {
                for (let tmpStickerInd=0; tmpStickerInd<scrambledStickersInFaces[tmpFaceInd].length;tmpStickerInd++) {
                    if (scrambledStickersInFaces[tmpFaceInd][tmpStickerInd][0] !== utils.solvedStickersInFaces[tmpFaceInd][tmpStickerInd][0]) {
                        // スワップする
                        uFaceFulfilledCnt++;
                        faceIndAtTarget = tmpFaceInd;
                        stickerIndAtTarget = tmpStickerInd;
                        break;
                    }
                }

                if (stickerIndAtTarget !== null) {
                    break;
                }
            }
        }

        const newStickerName = scrambledStickersInFaces[faceIndAtTarget][stickerIndAtTarget];
        const stickerToMemorize = utils.solvedStickersInFaces[faceIndAtTarget][stickerIndAtTarget];
        // console.log(`${stickerAtBuffer} goes to [${faceIndAtTarget}][${stickerIndAtTarget}] i.e. ${stickerToMemorize}`);
        stickersToMemorize.push(stickerToMemorize);

        // バッファと入れ替える
        scrambledStickersInFaces[bufferFaceInd][bufferStickerInd] = newStickerName;
        scrambledStickersInFaces[faceIndAtTarget][stickerIndAtTarget] = stickerAtBuffer;
        stickerAtBuffer = newStickerName;

        // console.log(scrambledStickersInFaces);
        // break;
    }
    // console.log('Result =');
    // console.log(scrambledStickersInFaces);

        const msg = `${i} ${stickersToMemorize}`;
        msgs.push(msg);
    }

    console.log(msgs.join('\n'));
    console.log(uFaceFulfilledCnt);
    console.log(1.0 * uFaceFulfilledCnt / loopCnt);
};




main()
