import Player from './player'
import Ship from './ship'
import Board from './board'
import './gui'
import 'normalize.css'
import './styles.css'

const p1 = new Player(false, 'Nathan')
const p2 = new Player(false, 'Computer')

while (!p1.board.shipsAllSunk() || !p2.board.shipsAllSunk()) {
    p1.makeRandomAttack(p2.board)
    p2.makeRandomAttack(p1.board)
}

const winner = p1.board.shipsAllSunk ? `${p2.name} wins!` : `${p1.name} wins!`
console.log(winner)
