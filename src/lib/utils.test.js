const utils = require('./utils');

describe('findStickerIndOfSolved()', () => {
    test('solvedStickers Ufr', () => {
        const buffer = 'Ufr';

        const expected = {
            faceInd: 0,
            stickerInd: 2,
        };

        expect(utils.findStickerInd(utils.solvedStickersInFaces, buffer)).toStrictEqual(expected);
    });
});

describe('findStickerIndOfSolved()', () => {
    test('solvedStickers Ufr', () => {
        const buffer = 'Ufr';

        const expected = {
            faceInd: 0,
            stickerInd: 2,
        };

        expect(utils.findStickerIndOfSolved(buffer)).toStrictEqual(expected);
    });
});

describe('isSolved()', () => {
    test('ソルブできている場合', () => {
        const scramble = [
            [ 'Ufl', 'Ubl', 'Ubr', 'Ufr', ],
            [ 'Lbu', 'Lfu', 'Ldf', 'Lbd', ],
            [ 'Flu', 'Fru', 'Frd', 'Fdl', ],
            [ 'Rfu', 'Rbu', 'Rbd', 'Rdf', ],
            [ 'Bru', 'Blu', 'Bdl', 'Bdr', ],
            [ 'Dfl', 'Dfr', 'Dbr', 'Dbl', ],
        ];

        expect(utils.isSolved(scramble)).toStrictEqual(true);
    });

    test('ソルブできていない場合', () => {
        const scramble = [
            [ 'Ufl', 'Lfu', 'Ubr', 'Ufr', ],
            [ 'Lbu', 'Ubl', 'Ldf', 'Lbd', ],
            [ 'Flu', 'Fru', 'Frd', 'Fdl', ],
            [ 'Rfu', 'Rbu', 'Rbd', 'Rdf', ],
            [ 'Bru', 'Blu', 'Bdl', 'Bdr', ],
            [ 'Dfl', 'Dfr', 'Dbr', 'Dbl', ],
        ];

        expect(utils.isSolved(scramble)).toStrictEqual(false);
    });
});
