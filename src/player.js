import Board from './board'

export default class Player {
    constructor(turn = false, name = 'human') {
        this.turn = turn
        this.name = name
        this.board = new Board()
        this.board.placeShips()
        this.unAttackedCoordinates = Object.keys(this.board.slotsMap)
    }

    makeAttack(enemyBoard, attackCoordinate) {
        enemyBoard.receiveAttack(attackCoordinate)
    }

    makeRandomAttack(enemyBoard) {
        const randomIndex = Math.floor(Math.random() * this.unAttackedCoordinates.length)
        const randomCoordinate = this.unAttackedCoordinates[randomIndex]
        this.makeAttack(enemyBoard, randomCoordinate)
        this.unAttackedCoordinates.splice(randomIndex, 1)
        console.log(`Attacked ${randomCoordinate}`)
    }
}
