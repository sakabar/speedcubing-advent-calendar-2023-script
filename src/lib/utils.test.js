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

describe('readScramble()', () => {
    test('正常系', () => {
        const inputStr = '0001\tBdl,Dbl,Rdf,Bru,Blu,Fru,Rbd,Bdr,Rfu,Rbu,Ldf,Frd,Flu,Ubr,Lbd,Ufl,Lfu,Dfr,Fdl,Ufr,Lbu,Dbr,Dfl,Ubl';

        const actual = utils.readScramble(inputStr);
        const expected = [
            [ 'Bdl', 'Dbl', 'Rdf', 'Bru', ],
            [ 'Blu', 'Fru', 'Rbd', 'Bdr', ],
            [ 'Rfu', 'Rbu', 'Ldf', 'Frd', ],
            [ 'Flu', 'Ubr', 'Lbd', 'Ufl', ],
            [ 'Lfu', 'Dfr', 'Fdl', 'Ufr', ],
            [ 'Lbu', 'Dbr', 'Dfl', 'Ubl', ],
        ];

        expect(actual).toStrictEqual(expected);
    });
});

describe('readPrioritySetting()', () => {
    test('正常系', () => {
        const inputStr = '0001\tUbl\t1,3,2,0_2,0,1,3_1,3,0,2_1,0,2,3_2,3,0,1_1,2,3,0';

        const actual = utils.readPrioritySetting(inputStr);
        const expected = [
            [ 1, 3, 2, 0, ],
            [ 2, 0, 1, 3, ],
            [ 1, 3, 0, 2, ],
            [ 1, 0, 2, 3, ],
            [ 2, 3, 0, 1, ],
            [ 1, 2, 3, 0, ],
        ];

        expect(actual).toStrictEqual(expected);
    });
});

describe('solve()', () => {
    test('正常系: 1ループで終わる場合', () => {

        const bufferStickerName = 'Ubl';
        const prioritySetting = [
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
        ];

        const facePrioritySetting = [ 3, 2, 1, 4, 5, 0, ];

        // 3点交換
        const scrambledStickersInFaces = [
            [ 'Lfu', 'Ubr', 'Ufr', 'Ufl', ],
            [ 'Lbu', 'Fru', 'Ldf', 'Lbd', ],
            [ 'Flu', 'Ubl', 'Frd', 'Fdl', ],
            [ 'Rfu', 'Rbu', 'Rbd', 'Rdf', ],
            [ 'Bru', 'Blu', 'Bdl', 'Bdr', ],
            [ 'Dfl', 'Dfr', 'Dbr', 'Dbl', ],
        ];


        const actual = utils.solve(bufferStickerName, prioritySetting, facePrioritySetting, scrambledStickersInFaces);

        const expected = [ 'Lfu', 'Fru', ];
        expect(actual).toStrictEqual(expected);
    });

    test('正常系: 2ループで終わる場合', () => {

        const bufferStickerName = 'Ubl';
        const prioritySetting = [
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
            [ 1, 2, 3, 0, ],
        ];

        const facePrioritySetting = [ 3, 2, 1, 4, 5, 0, ];

        const scrambledStickersInFaces = [
            [ 'Lfu', 'Ubr', 'Ufr', 'Ufl', ],
            [ 'Lbu', 'Ubl', 'Ldf', 'Lbd', ],
            [ 'Flu', 'Fru', 'Frd', 'Fdl', ],
            [ 'Rfu', 'Rbu', 'Rbd', 'Rdf', ],
            [ 'Bru', 'Dfr', 'Dbr', 'Bdr', ],
            [ 'Dfl', 'Blu', 'Bdl', 'Dbl', ],
        ];

        const actual = utils.solve(bufferStickerName, prioritySetting, facePrioritySetting, scrambledStickersInFaces);

        const expected = [ 'Lfu', 'Blu', 'Dfr', 'Bdl', 'Dbr', 'Blu', ];
        expect(actual).toStrictEqual(expected);
    });
});

describe('generateRegularPriorityArr()', () => {
    test('正常系: 時計回り バッファ以外', () => {
        const actual = utils.generateRegularPriorityArr(0, 0, 1, 1, true);

        const expected = [ 1, 2, 3, 0, ];
        expect(actual).toStrictEqual(expected);
    });

    test('正常系: 反時計回り バッファ以外', () => {
        const actual = utils.generateRegularPriorityArr(0, 0, 1, 1, false);

        const expected = [ 1, 0, 3, 2, ];
        expect(actual).toStrictEqual(expected);
    });

    test('正常系: 時計回り バッファ', () => {
        const actual = utils.generateRegularPriorityArr(1, 2, 1, 1, true);

        const expected = [ 1, 3, 0, 2, ];
        expect(actual).toStrictEqual(expected);
    });

    test('正常系: 反時計回り バッファ', () => {
        const actual = utils.generateRegularPriorityArr(1, 2, 1, 3, false);

        const expected = [ 3, 1, 0, 2, ];
        expect(actual).toStrictEqual(expected);
    });
});


describe('generateRegularPrioritySettings()', () => {
    test('総数が196,608パターンであること', () => {
        const actual = utils.generateRegularPrioritySettings('Ubl');

        // 196,608パターン
        const expected = (3 * 2) * (4 * 2) * (4 * 2) * (4 * 2) * (4 * 2) * (4 * 2);
        expect(actual.length).toBe(expected);
    });

    test('重複しないこと', () => {
        const actual = utils.generateRegularPrioritySettings('Ubl');

        // 196,608パターン
        const expected = new Set([...actual]).size;
        expect(actual.length).toBe(expected);
    });

    test('それぞれの値が0から3の順番を入れ替えた配列で構成されていること', () => {
        const actual = utils.generateRegularPrioritySettings('Ubl');

        // アサート文をたくさん書くと遅くなるので、アサートの結果をsetに加えていき最後に判定する
        const assertionResultSet = new Set();
        for (const prioritySetting of actual) {
            for (const priorityArr of prioritySetting) {
                const uniqed = new Set([...priorityArr]);

                assertionResultSet.add(uniqed.size === 4);
                for (let i=0; i<4; i++) {
                    assertionResultSet.add(uniqed.has(i));
                }
            }
        }

        expect(assertionResultSet.size).toBe(1);
        expect(assertionResultSet.has(true)).toBe(true);
    });
});
