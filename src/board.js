/* eslint-disable no-param-reassign */
export default class Board {
    constructor() {
        this.slotsMap = {}
        this.createBoardSlots()
        this.assignAllReferences()
    }

    createBoardSlots() {
        const letters = 'abcdefghij'
        for (let x = 0; x < 10; x += 1) {
            for (let y = 0; y < 10; y += 1) {
                this.slotsMap[`${letters[x]}${y}`] = {
                    up: null,
                    down: null,
                    left: null,
                    right: null,
                }
            }
        }
    }

    assignDirection(
        currentSlotCoordinate,
        directionReference,
        referenceSlotCoordinate
    ) {
        currentSlotCoordinate[directionReference] =
          referenceSlotCoordinate
    }

  assignAllReferences() {
      const letters = 'abcdefghij'
        for (const [key, value] of Object.entries(this.slotsMap)) {
            // Just easier to read variables
            const xCoordinate = key[0]
          const yCoordinate = Number(key[1])
          const xIndex = letters.indexOf(xCoordinate);
            if (xIndex < 9) {
                /* Assigns each slot's right direction to the slot one column to the right,
                          unless it's in the last column */
                this.assignDirection(
                    value,
                    'right',
                    `${letters[xIndex + 1]}${yCoordinate}`
                )
            }
            if (xIndex > 0) {
                /* Assigns each slot's left direction to the slot one column to the left,
                          unless it's in the first column */
                this.assignDirection(
                    value,
                    'left',
                    `${letters[xIndex - 1]}${yCoordinate}`
                )
            }
            if (yCoordinate > 0) {
                /* Assigns each slot's down direction to the slot one row below it,
                          unless it's in the bottom row */
                this.assignDirection(
                    value,
                    'down',
                    `${letters[xIndex]}${yCoordinate - 1}`
                )
            }
            if (yCoordinate < 9) {
                /* Assigns each slot's up direction to the slot one row above it,
                          unless it's in the top row */
                this.assignDirection(
                    value,
                    'up',
                    `${letters[xIndex]}${yCoordinate + 1}`
                )
            }
        }
    }
}
