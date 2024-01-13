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
    .then(() => gui.coverBoard(gui.p1Board))
    .then(() =>
        gui.changeFooterTextAndConfirm(
            `CHANGE: Now let ${p2.name} place ships. Click this message to continue.`
        )
    )
    .then(() => gui.showShipPlacement(p2))
    .then(() => gui.hideShips(gui.p2BoardGridSlots))
    // .then(() => gui.coverBoard(gui.p2Board))
    .then(() =>
        gui.changeFooterTextAndConfirm(
            `CHANGE: The game is about to begin. It is now ${p1.name}'s turn. Click this message to continue.`
        )
    )
    .then(() => gui.removeCoverBoard())
    .then(() => gui.takeTurn(p1, p2))
