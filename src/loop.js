import Player from './player'

const p1 = new Player(false, 'Nathan')
const p2 = new Player(false, 'Computer')

while (!p1.board.shipsAllSunk || !p2.board.shipsAllSunk) {
    p1.makeAttack();
    p2.makeAttack();
}
