/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
export default class Board {
    constructor() {
        this.slotsMap = {}
        this.ships = []
        this.receivedAttacks = []
        this.createBoardSlots()
        this.assignAllReferences()
    }

    createBoardSlots() {
        const letters = 'abcdefghij'
        for (let x = 0; x < 10; x += 1) {
            for (let y = 0; y < 10; y += 1) {
                this.slotsMap[`${letters[x]}${y}`] = {
                    occupied: false,
                    up: null,
                    down: null,
                    left: null,
                    right: null,
                }
            }
        }
    }

    assignDirectionReferenceToSlot(
        currentSlotCoordinate,
        directionReference,
        referenceSlotCoordinate
    ) {
        currentSlotCoordinate[directionReference] = referenceSlotCoordinate
    }

    assignAllReferences() {
        const letters = 'abcdefghij'
        for (const [key, value] of Object.entries(this.slotsMap)) {
            // Just easier to read variables
            const xCoordinate = key[0]
            const yCoordinate = Number(key[1])
            const xIndex = letters.indexOf(xCoordinate)
            if (xIndex < 9) {
                /* Assigns each slot's right direction to the slot one column to the right,
                          unless it's in the last column */
                this.assignDirectionReferenceToSlot(
                    value,
                    'right',
                    `${letters[xIndex + 1]}${yCoordinate}`
                )
            }
            if (xIndex > 0) {
                /* Assigns each slot's left direction to the slot one column to the left,
                          unless it's in the first column */
                this.assignDirectionReferenceToSlot(
                    value,
                    'left',
                    `${letters[xIndex - 1]}${yCoordinate}`
                )
            }
            if (yCoordinate > 0) {
                /* Assigns each slot's down direction to the slot one row below it,
                          unless it's in the bottom row */
                this.assignDirectionReferenceToSlot(
                    value,
                    'down',
                    `${letters[xIndex]}${yCoordinate - 1}`
                )
            }
            if (yCoordinate < 9) {
                /* Assigns each slot's up direction to the slot one row above it,
                          unless it's in the top row */
                this.assignDirectionReferenceToSlot(
                    value,
                    'up',
                    `${letters[xIndex]}${yCoordinate + 1}`
                )
            }
        }
    }

    placeShip(ship, intialSlotCoordinate, orientation = 'up') {
        // Checks if initial slot is occupied or non-existent
        if (
            this.slotsMap[intialSlotCoordinate].occupied !== false ||
            !this.validCoordinate(intialSlotCoordinate)
        ) {
            return false
        }

        // Will be the # of times to check in for loop
        const numberOfSlotsToOccupy = ship.length

        // Initalizes next slot to check before running loop
        let nextSlot = this.slotsMap[intialSlotCoordinate][orientation]
        const slotsToOccupy = [intialSlotCoordinate]

        /* Checks if there is room for the ship
         i = 1 since initial slot is provided by player */
        for (let i = 1; i < numberOfSlotsToOccupy; i++) {
            if (
                // End if next slot doesn't exist
                !this.validCoordinate(nextSlot)
            ) {
                return false
            }
            if (this.slotsMap[nextSlot].occupied === false) {
                slotsToOccupy.push(nextSlot)
                nextSlot = this.slotsMap[nextSlot][orientation]
            } else {
                // Ship cannot fit here!
                return false
            }
        }

        /* Loop over occupied slots,
        Changing their occupied value to true */
        for (let i = 0; i < slotsToOccupy.length; i++) {
            const currentSlot = slotsToOccupy[i]
            this.slotsMap[currentSlot].occupied = true
        }

        // Update the ship's slots to that of the array
        ship.slots = slotsToOccupy
        this.ships.push(ship)
        return true
    }

    validCoordinate(coordinate) {
        if (this.slotsMap[coordinate] === undefined || 
            this.slotsMap[coordinate] === null) {
            return false
        }
        return true
    }

    receiveAttack(coordinate) {
        if (!this.validCoordinate(coordinate) || this.receivedAttacks.includes(coordinate)) {
            return false // Not a valid coordinate, or has already been attacked
        }
        this.ships.forEach(ship => {
            if (ship.slots.includes(coordinate)) {
                // Attack hits
                ship.hit()
                ship.isSunk()
            }
        });
        
        // For a hit or miss, store the attack
        this.receivedAttacks.push(coordinate)
        return true
    }

    shipsAllSunk() {
        let shipCount = this.ships.length
        let sankShips = 0
         this.ships.forEach((ship) => {
             if (ship.sunk) {
                 sankShips++
             }
         })
        if (sankShips === shipCount) {
            return true
        }
        return false
    }
}
