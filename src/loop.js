import Player from './player'
import Ship from './ship'
import Board from './board'
import Gui from './gui'
import 'normalize.css'
import './styles.css'

const p1 = new Player(false, 'Player 1')
const p2 = new Player(false, 'Player 2')
p1.shipsToPlace = p1.board.arrayOfShips()
p2.shipsToPlace = p2.board.arrayOfShips()
const gui = new Gui()
gui.showShipPlacement(p1)
    .then(() => gui.showShipPlacement(p2))


// while (!p1.board.shipsAllSunk() || !p2.board.shipsAllSunk()) {
//     p1.makeRandomAttack(p2.board)
//     p2.makeRandomAttack(p1.board)
// }

// const winner = p1.board.shipsAllSunk ? `${p2.name} wins!` : `${p1.name} wins!`
// console.log(winner)
