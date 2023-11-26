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
            [ 'Flu', 'Fru', 'Fdr', 'Fdl', ],
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
            [ 'Flu', 'Fru', 'Fdr', 'Fdl', ],
            [ 'Rfu', 'Rbu', 'Rbd', 'Rdf', ],
            [ 'Bru', 'Blu', 'Bdl', 'Bdr', ],
            [ 'Dfl', 'Dfr', 'Dbr', 'Dbl', ],
        ];

        expect(utils.isSolved(scramble)).toStrictEqual(false);
    });
});

describe('readScramble()', () => {
    test('正常系', () => {
        const inputStr = '0001\tBdl,Dbl,Rdf,Bru,Blu,Fru,Rbd,Bdr,Rfu,Rbu,Ldf,Fdr,Flu,Ubr,Lbd,Ufl,Lfu,Dfr,Fdl,Ufr,Lbu,Dbr,Dfl,Ubl';

        const actual = utils.readScramble(inputStr);
        const expected = {
            scrambleLabel: '0001',
            scrambledStickersInFaces: [
                [ 'Bdl', 'Dbl', 'Rdf', 'Bru', ],
                [ 'Blu', 'Fru', 'Rbd', 'Bdr', ],
                [ 'Rfu', 'Rbu', 'Ldf', 'Fdr', ],
                [ 'Flu', 'Ubr', 'Lbd', 'Ufl', ],
                [ 'Lfu', 'Dfr', 'Fdl', 'Ufr', ],
                [ 'Lbu', 'Dbr', 'Dfl', 'Ubl', ],
            ],
        };

        expect(actual).toStrictEqual(expected);
    });
});

describe('readPrioritySetting()', () => {
    test('正常系', () => {
        const inputStr = '0001\tUbl\t1,3,2,0_2,0,1,3_1,3,0,2_1,0,2,3_2,3,0,1_1,2,3,0';

        const actual = utils.readPrioritySetting(inputStr);
        const expected = {
            prioritySettingLabel: '0001',
            bufferStickerName: 'Ubl',
            prioritySetting: [
                [ 1, 3, 2, 0, ],
                [ 2, 0, 1, 3, ],
                [ 1, 3, 0, 2, ],
                [ 1, 0, 2, 3, ],
                [ 2, 3, 0, 1, ],
                [ 1, 2, 3, 0, ],
            ],
        };

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
            [ 'Flu', 'Ubl', 'Fdr', 'Fdl', ],
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
            [ 'Flu', 'Fru', 'Fdr', 'Fdl', ],
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

describe('inverseMove()', () => {
    test('時計回り', () => {
        const actual = utils.inverseMove('x');
        const expected = "x'";
        expect(actual).toBe(expected);
    });

    test('反時計回り', () => {
        const actual = utils.inverseMove("x'");
        const expected = "x";
        expect(actual).toBe(expected);
    });

    test('180度回転', () => {
        const actual = utils.inverseMove("x2");
        const expected = "x2";
        expect(actual).toBe(expected);
    });
});

describe('inverseMoves()', () => {
    test('正常系', () => {
        const actual = utils.inverseMoves('a b c');
        const expected = "c' b' a'";
        expect(actual).toBe(expected);
    });
});

describe('getMoveType()', () => {
    test('U', () => {
        expect(utils.getMoveType('U')).toBe('U');
    });

    test("U'", () => {
        expect(utils.getMoveType("U'")).toBe('U');
    });

    test('U2', () => {
        expect(utils.getMoveType('U2')).toBe('U');
    });

    test('Lw2', () => {
        expect(utils.getMoveType('Lw2')).toBe('Lw');
    });
});

describe('cancelMoves()', () => {
    test('U + U = U2', () => {
        const inputStr = "U U";
        expect(utils.cancelMoves(inputStr)).toBe('U2');
    });

    test("U + U' = empty", () => {
        const inputStr = "U U'";
        expect(utils.cancelMoves(inputStr)).toBe('');
    });

    test("U + R = U + R", () => {
        const inputStr = "U R";
        expect(utils.cancelMoves(inputStr)).toBe('U R');
    });
});


describe('parseThreeStyle()', () => {
    test('カッコ無しの場合はそのまま', () => {
        const inputStr = "U r' d r U' r' d' r";
        const actual = utils.parseThreeStyle(inputStr);
        const expected = "U r' d r U' r' d' r";

        expect(actual).toBe(expected);
    });

    test('セットアップ無し', () => {
        const inputStr = "[U, r' d r]";
        const actual = utils.parseThreeStyle(inputStr);
        const expected = "U r' d r U' r' d' r";

        expect(actual).toBe(expected);
    });

    test('セットアップ有り、キャンセル無し', () => {
        const inputStr = "[R2: [r' d r, U2]]";
        const actual = utils.parseThreeStyle(inputStr);
        const expected = "R2 r' d r U2 r' d' r U2 R2";

        expect(actual).toBe(expected);
    });

    test('セットアップ有り、キャンセル有り', () => {
        const inputStr = "[U2: [r' d r, U']]";
        const actual = utils.parseThreeStyle(inputStr);
        const expected = "U2 r' d r U' r' d' r U'";

        expect(actual).toBe(expected);
    });
});

describe('getNumberOfMoves()', () => {
    test('U', () => {
        expect(utils.getNumberOfMoves('U')).toBe(1);
    });

    test("U'", () => {
        expect(utils.getNumberOfMoves("U'")).toBe(1);
    });

    test('U2: QTMで2手', () => {
        expect(utils.getNumberOfMoves('U2')).toBe(2);
    });

    test("U R", () => {
        expect(utils.getNumberOfMoves("U R")).toBe(2);
    });

    test("x U : 持ち替えは3手", () => {
        expect(utils.getNumberOfMoves("x U")).toBe(4);
    });

    test("x y U : 連続する持ち替えはひとまとまりとして教える", () => {
        expect(utils.getNumberOfMoves("x y U")).toBe(4);
    });

    test("U d U': u系以外のスライスムーブは2手", () => {
        expect(utils.getNumberOfMoves("U d U'")).toBe(4);
    });
});
