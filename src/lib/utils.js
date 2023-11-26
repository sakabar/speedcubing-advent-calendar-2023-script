const _ = require('lodash');

// その面を正面から見て、左上から時計回り
const solvedStickersInFaces = [
    [ 'Ubl', 'Ubr', 'Ufr', 'Ufl', ],
    [ 'Lbu', 'Lfu', 'Ldf', 'Lbd', ],
    [ 'Flu', 'Fru', 'Fdr', 'Fdl', ],
    [ 'Rfu', 'Rbu', 'Rbd', 'Rdf', ],
    [ 'Bru', 'Blu', 'Bdl', 'Bdr', ],
    [ 'Dfl', 'Dfr', 'Dbr', 'Dbl', ],
];

// 初期準備
const stickerNameToIndObj = {};
for (let tmpFaceInd = 0; tmpFaceInd < solvedStickersInFaces.length; tmpFaceInd++) {
    const stickerInFace = solvedStickersInFaces[tmpFaceInd];

    for (let tmpStickerInFaceInd = 0; tmpStickerInFaceInd < stickerInFace.length; tmpStickerInFaceInd++) {
        const sticker = stickerInFace[tmpStickerInFaceInd];

        stickerNameToIndObj[sticker] = {
            faceInd: tmpFaceInd,
            stickerInd: tmpStickerInFaceInd,
        };
    }
}

const findStickerIndOfSolved = (sticker) => {
    return stickerNameToIndObj[sticker];
}

const findStickerInd = (stickersInFaces, sticker) => {
    let faceInd  = null;
    let stickerInd = null;

    for (let tmpFaceInd = 0; tmpFaceInd < stickersInFaces.length; tmpFaceInd++) {
        const stickerInFace = stickersInFaces[tmpFaceInd];

        for (let tmpStickerInFaceInd = 0; tmpStickerInFaceInd < stickerInFace.length; tmpStickerInFaceInd++) {
            const tmpSticker = stickerInFace[tmpStickerInFaceInd];
            if (tmpSticker === sticker) {
                faceInd = tmpFaceInd;
                stickerInd = tmpStickerInFaceInd;
                break;
            }
        }
    }

    if (faceInd === null || stickerInd === null) {
        throw new Error(`${sticker} NOT FOUND`);
    }

    return {
        faceInd,
        stickerInd,
    };
};

const isSolved = (scrambledStickersInFaces) => {
    let ans = true;
    for (let tmpFaceInd=0; tmpFaceInd<scrambledStickersInFaces.length;tmpFaceInd++) {
        for (let tmpStickerInd=0; tmpStickerInd<scrambledStickersInFaces[tmpFaceInd].length;tmpStickerInd++) {
            if (scrambledStickersInFaces[tmpFaceInd][tmpStickerInd][0] !== solvedStickersInFaces[tmpFaceInd][tmpStickerInd][0]) {
                ans = false;
                break;
            }
        }
    }

    return ans;
};

const readScramble = (inputStr) => {
    const columns = inputStr.split('\t');

    const scrambleLabel = columns[0]
    const scrambledStickersInFaces = _.chunk(columns[1].split(','), 4);

    return {
        scrambleLabel,
        scrambledStickersInFaces,
    };
};

const readPrioritySetting = (inputStr) => {
    const columns = inputStr.split('\t');
    const prioritySettingLabel = columns[0];
    const bufferStickerName = columns[1];
    const prioritySetting = columns[2].split('_').map(s => s.split(',').map(c => parseInt(c)));

    return {
        prioritySettingLabel,
        bufferStickerName,
        prioritySetting,
    };
};

const solve = (bufferStickerName, inputPrioritySetting, facePrioritySetting, inputScrambledStickersInFaces) => {
    // スクランブルを破壊的に更新していくので、先にコピーを作っておく
    const scrambledStickersInFaces = _.cloneDeep(inputScrambledStickersInFaces);

    // prioritySettingも2ループ目から更新して破壊していくので、コピーを作っておくする
    const prioritySetting = _.cloneDeep(inputPrioritySetting);

    const {
        faceInd: bufferFaceInd,
        stickerInd: bufferStickerInd,
    } = findStickerIndOfSolved(bufferStickerName);

    // まず、bufferFaceIndとbufferStickerIndを見る
    let stickerAtBuffer = scrambledStickersInFaces[bufferFaceInd][bufferStickerInd];
    const stickersToMemorize = [];

    while (!isSolved(scrambledStickersInFaces)) {
        // そのステッカーが本来入るべきステッカーの面の中で、まだ埋まっていない面をprioritySettingに従って見る
        let {
            faceInd: faceIndAtTarget,
            stickerInd: strictStickerIndAtTarget,
        } = findStickerIndOfSolved(stickerAtBuffer);


        let stickerIndAtTarget = null;
        const priorityInFace = prioritySetting[faceIndAtTarget];
        // console.log(priorityInFace);

        for (const priorityStickerInd of priorityInFace) {
            const priorityStickerName = solvedStickersInFaces[faceIndAtTarget][priorityStickerInd];

            // そのステッカーはもう正しく埋まっているか?
            if (scrambledStickersInFaces[faceIndAtTarget][priorityStickerInd][0] !== priorityStickerName[0]) {
                stickerIndAtTarget = priorityStickerInd;

                break;
            }
        }

        // 白面が全て埋まっていた場合にはstickerIndAtTargetがnullとなる
        if (stickerIndAtTarget === null) {
            // console.log('U Face is fulfilled');

            // facePrioritySettingの順に従って、正しく埋まっていないステッカーを1つ選び、入れ換える
            for (const tmpFaceInd of facePrioritySetting) {
                for (let tmpStickerInd=0; tmpStickerInd<scrambledStickersInFaces[tmpFaceInd].length;tmpStickerInd++) {
                    if (scrambledStickersInFaces[tmpFaceInd][tmpStickerInd][0] !== solvedStickersInFaces[tmpFaceInd][tmpStickerInd][0]) {
                        // スワップする
                        faceIndAtTarget = tmpFaceInd;
                        stickerIndAtTarget = tmpStickerInd;

                        // ループ開始に選んだステッカーがループ終了時に選ばれるように、prioritySettingを更新する
                        const newArr = prioritySetting[tmpFaceInd].filter(ind => ind !== stickerIndAtTarget);
                        newArr.push(tmpStickerInd);
                        prioritySetting[tmpFaceInd] = newArr;
                        break;
                    }
                }

                if (stickerIndAtTarget !== null) {
                    break;
                }
            }
        }

        const newStickerName = scrambledStickersInFaces[faceIndAtTarget][stickerIndAtTarget];
        const stickerToMemorize = solvedStickersInFaces[faceIndAtTarget][stickerIndAtTarget];
        // console.log(`${stickerAtBuffer} goes to [${faceIndAtTarget}][${stickerIndAtTarget}] i.e. ${stickerToMemorize}`);
        stickersToMemorize.push(stickerToMemorize);

        // バッファと入れ替える
        scrambledStickersInFaces[bufferFaceInd][bufferStickerInd] = newStickerName;
        scrambledStickersInFaces[faceIndAtTarget][stickerIndAtTarget] = stickerAtBuffer;
        stickerAtBuffer = newStickerName;
    }

    return stickersToMemorize;
};

const generateRegularPriorityArr = (bufferFaceInd, bufferStickerInd, faceInd, startInd, isClockwise) => {
    if (bufferFaceInd === faceInd) {
        // バッファの場合、バッファが必ず最後に来るようにする

        // バッファじゃない扱いで生成した後に調整する
        const dummyBufferFaceInd = (faceInd + 1) % 6;
        const generatedAsNonBufferFace = generateRegularPriorityArr(dummyBufferFaceInd, bufferStickerInd, faceInd, startInd, isClockwise);

        const ans = generatedAsNonBufferFace.filter(i => i !== bufferStickerInd);
        ans.push(bufferStickerInd);
        return ans;
    } else {
        if (isClockwise) {
            return _.range(startInd, startInd+4).map(i => i%4);
        } else {
            return _.range(startInd, startInd-4, -1).map(i => (i+4)%4);
        }
    }
}

const generateRegularPrioritySettings = (bufferStickerName) => {
    const {
        faceInd: bufferFaceInd,
        stickerInd: bufferStickerInd,
    } = findStickerIndOfSolved(bufferStickerName);

    const ans = [];

    // 愚直だが、12重ループで書く
    for (let uFaceStartInd=0; uFaceStartInd<4; uFaceStartInd++) {
        for (let lFaceStartInd=0; lFaceStartInd<4; lFaceStartInd++) {
            for (let fFaceStartInd=0; fFaceStartInd<4; fFaceStartInd++) {
                for (let rFaceStartInd=0; rFaceStartInd<4; rFaceStartInd++) {
                    for (let bFaceStartInd=0; bFaceStartInd<4; bFaceStartInd++) {
                        for (let dFaceStartInd=0; dFaceStartInd<4; dFaceStartInd++) {
                            for (const isUFaceClockwise of [true, false]) {
                                for (const isLFaceClockwise of [true, false]) {
                                    for (const isFFaceClockwise of [true, false]) {
                                        for (const isRFaceClockwise of [true, false]) {
                                            for (const isBFaceClockwise of [true, false]) {
                                                for (const isDFaceClockwise of [true, false]) {

                                                    let isOk = true;

                                                    // startIndがバッファと同じ場合は、バッファを最後に回す処理が動くことにより、実質的に他のステッカーが起点となる場合と同じになってしまうため、ダブルカウントを防ぐために除外する。
                                                    switch (bufferFaceInd) {
                                                    case 0:
                                                        isOk = uFaceStartInd !== bufferStickerInd;
                                                        break;
                                                    case 1:
                                                        isOk = lFaceStartInd !== bufferStickerInd;
                                                        break;
                                                    case 2:
                                                        isOk = fFaceStartInd !== bufferStickerInd;
                                                        break;
                                                    case 3:
                                                        isOk = rFaceStartInd !== bufferStickerInd;
                                                        break;
                                                    case 4:
                                                        isOk = bFaceStartInd !== bufferStickerInd;
                                                        break;
                                                    case 5:
                                                        isOk = dFaceStartInd !== bufferStickerInd;
                                                        break;
                                                    }

                                                    if (isOk) {
                                                        const prioritySetting = [
                                                            generateRegularPriorityArr(bufferFaceInd, bufferStickerInd, 0, uFaceStartInd, isUFaceClockwise),
                                                            generateRegularPriorityArr(bufferFaceInd, bufferStickerInd, 1, lFaceStartInd, isLFaceClockwise),
                                                            generateRegularPriorityArr(bufferFaceInd, bufferStickerInd, 2, fFaceStartInd, isFFaceClockwise),
                                                            generateRegularPriorityArr(bufferFaceInd, bufferStickerInd, 3, rFaceStartInd, isRFaceClockwise),
                                                            generateRegularPriorityArr(bufferFaceInd, bufferStickerInd, 4, bFaceStartInd, isBFaceClockwise),
                                                            generateRegularPriorityArr(bufferFaceInd, bufferStickerInd, 5, dFaceStartInd, isDFaceClockwise),
                                                        ];

                                                        ans.push(prioritySetting);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return ans;
}

const inverseMove = (moveStr) => {
    if (moveStr.slice(-1) === "'") {
        return moveStr.slice(0, -1);
    } else if (moveStr.slice(-1) === '2') {
        return moveStr;
    } else {
        return `${moveStr}'`;
    }
};

const inverseMoves = (movesStr) => {
    const ans = movesStr.split(/\s+/).map(moveStr => inverseMove(moveStr));
    ans.reverse();

    return ans.join(' ');
};

const getMoveType = (moveStr) => {
    if (moveStr.slice(-1) === "'" || moveStr.slice(-1) === '2') {
        return moveStr.slice(0, -1);
    } else {
        return moveStr;
    }
};

// QTM: QuarterTurnMetric
const getQuarterDegreeOfMove = (moveStr) => {
    if (moveStr.slice(-1) === "'") {
        return -1;
    } else if (moveStr.slice(-1) === '2') {
        return 2;
    } else {
        return 1;
    }
};

const qtmToMove = (moveStr, qtm) => {
    switch ((qtm + 4)% 4) {
    case 0:
        return '';
    case 1:
        return getMoveType(moveStr);
    case 2:
        return `${getMoveType(moveStr)}2`;
    case 3:
        return `${getMoveType(moveStr)}'`;
    }
}

const cancelMoves = (movesStr) => {
    // スタックに積んで処理する
    const stack = [];

    for (const moveStr of movesStr.split(/\s+/)) {
        if (stack.length === 0) {
            stack.push(moveStr);
        } else {
            const top = stack.slice(-1)[0];

            if (getMoveType(moveStr) === getMoveType(top)) {
                const qtm = getQuarterDegreeOfMove(moveStr) + getQuarterDegreeOfMove(top);
                const canceledMove = qtmToMove(moveStr, qtm);
                stack.pop();
                stack.push(canceledMove);
            } else {
                stack.push(moveStr);
            }
        }
    }

    return stack.join(' ');
}

const parseThreeStyle = (inputStr) => {
    const nonSetupRe = /^\[([^,]+),([^,]+)\]$/;
    const setupRe = /^\[(.*?): (.+)\]$/;

    const nonSetupMatch = inputStr.match(nonSetupRe);
    const setupMatch = inputStr.match(setupRe);

    if (setupMatch) {
        const setup = setupMatch[1].trim();
        const rest = setupMatch[2].trim();

        return cancelMoves(`${setup} ${parseThreeStyle(rest)} ${inverseMoves(setup)}`);
    } else if (nonSetupMatch) {
        const move1 = nonSetupMatch[1].trim();
        const move2 = nonSetupMatch[2].trim();

        return cancelMoves(`${move1} ${move2} ${inverseMoves(move1)} ${inverseMoves(move2)}`);
    }

    return cancelMoves(inputStr);
};

const getNumberOfMove = (moveStr) => {
    if ([ 'l', 'r', 'd', ].includes(getMoveType(moveStr))) {
        return 2;
    } else if ([ 'x', 'y', 'z', ].includes(getMoveType(moveStr))) {
        return 3;
    } else {
        return 1;
    }
};

// 基本的にはQTM
// u, u'以外のスライスは2手
// 持ち替えは3手。ただし、連続する持ち替えは1つとして教える。 (例: x yの持ち替えは3手)
const getNumberOfMoves = (canceledMovesStr) => {
    let ans = 0;

    let previousMoveType = null;
    for (const moveStr of canceledMovesStr.split(/\s+/)) {
        if (previousMoveType !== null && [ 'x', 'y', 'z', ].includes(getMoveType(previousMoveType)) && [ 'x', 'y', 'z', ].includes(getMoveType(moveStr))) {
            // 連続する持ち替えは1つとして教える。前の回転の時にカウントしたはずなので加算しない
            ans += 0;
        } else if (moveStr.slice(-1) === '2') {
            ans += getNumberOfMove(moveStr) * 2;
        } else {
            ans += getNumberOfMove(moveStr);
        }

        previousMoveType = getMoveType(moveStr);
    }

    return ans;
}

module.exports.solvedStickersInFaces = solvedStickersInFaces;
module.exports.findStickerInd = findStickerInd;
module.exports.findStickerIndOfSolved = findStickerIndOfSolved;
module.exports.isSolved = isSolved;
module.exports.readScramble = readScramble;
module.exports.readPrioritySetting = readPrioritySetting;
module.exports.solve = solve;
module.exports.generateRegularPriorityArr = generateRegularPriorityArr;
module.exports.generateRegularPrioritySettings = generateRegularPrioritySettings;
module.exports.inverseMove = inverseMove;
module.exports.inverseMoves = inverseMoves;
module.exports.getMoveType = getMoveType;
module.exports.cancelMoves = cancelMoves;
module.exports.parseThreeStyle = parseThreeStyle;
module.exports.getNumberOfMoves = getNumberOfMoves;
