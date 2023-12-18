import Board from '../src/board'

test('corner slot references', () => {
    let p1Board = new Board()
    expect(p1Board.slotsMap['a9']).toEqual({
        down: 'a8',
        left: null,
        right: 'b9',
        up: null,
    })
    expect(p1Board.slotsMap['j9']).toEqual({
        down: 'j8',
        left: 'i9',
        right: null,
        up: null,
    })
    expect(p1Board.slotsMap['a0']).toEqual({
        down: null,
        left: null,
        right: 'b0',
        up: 'a1',
    })
    expect(p1Board.slotsMap['j0']).toEqual({
        down: null,
        left: 'i0',
        right: null,
        up: 'j1',
    })
})
