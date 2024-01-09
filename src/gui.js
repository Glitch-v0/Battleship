export default class Gui {
    constructor() {
        this.p1Board = document.getElementById('p1Board')
        this.p2Board = document.getElementById('p2Board')
        this.footer = document.getElementById('footer')
        this.createGridCells()
        this.p1BoardGridCells = this.p1Board.children
        this.p2BoardGridCells = this.p2Board.children
    }

    createGridCells() {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        for (let i = 9; i >= 0; i--) {
            //Sets up 0 to be the bottom of the grid, 9 at the top
            for (let j = 0; j < 10; j++) {
                const p1GridCell = document.createElement('div')
                const p2GridCell = document.createElement('div')
                p1GridCell.id = `${alphabet[j]}${i}`
                p1GridCell.classList.add('gridCell')
                p1GridCell.classList.add('p1GridCell')
                p2GridCell.id = `${alphabet[j]}${i}`
                p2GridCell.classList.add('gridCell')
                p2GridCell.classList.add('p2GridCell')
                p1Board.appendChild(p1GridCell)
                p2Board.appendChild(p2GridCell)
            }
        }
    }

    changeFooterText(text) {
        footer.innerText = text
    }

    placeShipChangeFooterText(player, ship, cell) {
        player.board.placeShip(ship, cell.id, 'up')
        this.changeFooterText(`Placing ${ship.title} at ${cell.id} `)
    }

    highlightCellsOnMouseHover(arrayOfSlotIDs, arrayOfSlotElements) {
        if (arrayOfSlotIDs !== false) {
            if (arrayOfSlotElements.length === 0) {
                // Only adds to array if array is empty
                for (const slot of arrayOfSlotIDs) {
                    // convert returned id's to actual html elements
                    arrayOfSlotElements.push(document.getElementById(slot))
                }
            }
            for (const slot of arrayOfSlotElements) {
                slot.style.backgroundColor = 'rgb(0, 70, 127)'
            }
        }
    }

    addOccupiedToEachSlotsClass(arrayOfSlots) {
        arrayOfSlots.forEach((slot) => {
            slot.classList.add('occupied')
        })
    }

    getSlotElementsFromIDs(arrayOfElementIDs) {
        const slotElementsFromIDS = []
    }

    removeAllListeners() {
       for (let slot of this.p1BoardGridCells) {
            const parent = slot.parentElement
            const replacement = slot.cloneNode(true)
            slot.id = undefined
            parent.replaceChild(replacement, slot)
        };
    }

    showShipPlacement(player) {
        let currentShip = player.shipsToPlace[0]
        return new Promise((resolve, reject) => {
            const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
            for (let cell of this.p1BoardGridCells) {
                let slotElementsFromIDS = []
                let slotIDsToHighlight
                cell.addEventListener('mouseover', (event) => {
                    currentShip = player.shipsToPlace[0]
                    console.log(`Current ship: ${currentShip.title}`)
                    slotIDsToHighlight = player.board.selectSlots(
                        //only sets value INITIALLY, but NOT after placing a ship. returns an array or false
                        cell.id,
                        currentShip.length
                    )
                    if (slotIDsToHighlight !== false) { //if an array exists.
                        if (slotElementsFromIDS.length === 0) {
                            // Only adds to array if array is empty
                            for (const slot of slotIDsToHighlight) {
                                // convert returned id's to actual html elements
                                slotElementsFromIDS.push(
                                    document.getElementById(slot)
                                )
                            }
                        }
                        for (const slot of slotElementsFromIDS) {
                            slot.classList.add('highlight')
                        }
                    }
                })
                cell.addEventListener('mouseleave', (event) => {
                    // to undo the color change
                    for (const slot of slotElementsFromIDS) {
                        slot.classList.remove('highlight')
                    }
                })
                cell.addEventListener('click', (event) => {
                    if (
                        slotIDsToHighlight !== false &&
                        player.board.slotsMap[cell.id].occupied === false
                    ) {
                        const parent = cell.parentElement
                        player.board.placeShip(currentShip, cell.id, 'up')
                        console.log(`Placed ${currentShip.title} at coordinates (${currentShip.slots})`)
                        this.addOccupiedToEachSlotsClass(slotElementsFromIDS)
                        slotElementsFromIDS.forEach((slot) => {
                            const replacement = slot.cloneNode(true)
                            slot.id = undefined
                            parent.replaceChild(replacement, slot)
                            slot.classList.remove('highlight')
                            console.log(`slot classlists: ${slot.classList}`)
                        })
                        player.shipsToPlace.shift()
                        if (player.shipsToPlace.length === 0) {
                            this.removeAllListeners()
                            resolve(true)
                        } else { //update current ship and notify player of next placement
                            currentShip = player.shipsToPlace[0]
                            this.changeFooterText(`Now place your ${currentShip.title}. (${currentShip.length} slots)`)
                            
                        }
                    }
                })
            }
        })
    }
}
