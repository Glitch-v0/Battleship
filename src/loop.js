import Player from './player'
import Ship from './ship'
import Board from './board'
import Gui from './gui'
import 'normalize.css'
import './styles.css'

const p1 = new Player(false, 'Nathan')
const p2 = new Player(false, 'Computer')
const p1Ships = p1.board.arrayOfShips()
const p2Ships = p2.board.arrayOfShips()
const gui = new Gui()
gui.changeFooterText("Let's play Battleship! First, place your Carrier (5 Tiles).")
gui.showShipPlacement(p1Ships[0], p1);
// while (!p1.board.shipsAllSunk() || !p2.board.shipsAllSunk()) {
//     p1.makeRandomAttack(p2.board)
//     p2.makeRandomAttack(p1.board)
// }

// const winner = p1.board.shipsAllSunk ? `${p2.name} wins!` : `${p1.name} wins!`
// console.log(winner)
