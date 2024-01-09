import Board from './board'

export default class Player {
    constructor(turn = false, name = 'human') {
        this.turn = turn
        this.name = name
        this.board = new Board()
        this.unAttackedCoordinates = Object.keys(this.board.slotsMap)
        this.shipsToPlace
    }

    makeAttack(enemyBoard, attackCoordinate) {
        if (enemyBoard.receiveAttack(attackCoordinate)) {
            this.unAttackedCoordinates.splice(this.unAttackedCoordinates.indexOf(attackCoordinate), 1)
            return true
        }
        return false
    }

    makeRandomAttack(enemyBoard) {
        const randomIndex = Math.floor(Math.random() * this.unAttackedCoordinates.length)
        const randomCoordinate = this.unAttackedCoordinates[randomIndex]
        return this.makeAttack(enemyBoard, randomCoordinate)
    }
}
