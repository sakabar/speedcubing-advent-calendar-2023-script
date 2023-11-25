// その面を正面から見て、左上から時計回り
const solvedStickersInFaces = [
    [ 'Ubl', 'Ubr', 'Ufr', 'Ufl', ],
    [ 'Lbu', 'Lfu', 'Ldf', 'Lbd', ],
    [ 'Flu', 'Fru', 'Frd', 'Fdl', ],
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

module.exports.solvedStickersInFaces = solvedStickersInFaces;
module.exports.findStickerInd = findStickerInd;
module.exports.findStickerIndOfSolved = findStickerIndOfSolved;
module.exports.isSolved = isSolved;
