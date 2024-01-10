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
                p1GridCell.id = `${alphabet[j]}${i}p1`
                p1GridCell.classList.add('gridCell')
                p1GridCell.classList.add('p1GridCell')
                this.p1Board.appendChild(p1GridCell)

                const p2GridCell = document.createElement('div')
                p2GridCell.id = `${alphabet[j]}${i}p2`
                p2GridCell.classList.add('gridCell')
                p2GridCell.classList.add('p2GridCell')
                this.p2Board.appendChild(p2GridCell)
            }
        }
    }

    changeFooterText(text) {
        this.footer.innerText = text
    }

    changeFooterTextAndConfirm(text) {
        this.footer.innerText = text
        return new Promise((resolve, reject) => {
            this.footer.addEventListener('click', (event) => {
                resolve()
            })
        })
    }

    addOccupiedToEachSlotsClass(arrayOfSlots) {
        arrayOfSlots.forEach((slot) => {
            slot.classList.add('occupied')
        })
    }

    removeAllListeners(slotsToRemoveListeners) {
        for (let slot of slotsToRemoveListeners) {
            const parent = slot.parentElement
            const replacement = slot.cloneNode(true)
            slot.id = undefined
            parent.replaceChild(replacement, slot)
        }
    }

    showShipPlacement(player) {
        let currentShip = player.shipsToPlace[0]
        this.changeFooterText(
            `Now place your ${currentShip.title}. (${currentShip.length} slots)`
        )
        const currentGridCells =
            player.name === 'Player 1'
                ? this.p1BoardGridCells
                : this.p2BoardGridCells
        return new Promise((resolve, reject) => {
            const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
            for (let cell of currentGridCells) {
                const currentID = cell.id.substring(0, 2)
                const playerIDTag = cell.id.substring(2)
                let slotElementsFromIDS
                let slotIDsToHighlight
                cell.addEventListener('mouseover', (event) => {
                    currentShip = player.shipsToPlace[0]
                    slotElementsFromIDS = []
                    slotIDsToHighlight = player.board.selectSlots(
                        //only sets value INITIALLY, but NOT after placing a ship. returns an array or false
                        currentID,
                        currentShip.length
                    )
                    if (slotIDsToHighlight !== false) {
                        //if an array exists.
                        if (slotElementsFromIDS.length === 0) {
                            // Only adds to array if array is empty
                            for (const slot of slotIDsToHighlight) {
                                // convert returned id's to actual html elements
                                slotElementsFromIDS.push(
                                    document.getElementById(`${slot+playerIDTag}`)
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
                        player.board.slotsMap[currentID].occupied === false
                    ) {
                        const parent = cell.parentElement
                        player.board.placeShip(currentShip, currentID, 'up')
                        console.log(
                            `Placed ${currentShip.title} at coordinates (${currentShip.slots})`
                        )
                        this.addOccupiedToEachSlotsClass(slotElementsFromIDS)
                        slotElementsFromIDS.forEach((slot) => {
                            const replacement = slot.cloneNode(true)
                            slot.id = undefined
                            parent.replaceChild(replacement, slot)
                        })
                        player.shipsToPlace.shift()
                        if (player.shipsToPlace.length === 0) {
                            this.removeAllListeners(currentGridCells)
                            resolve(true)
                        } else {
                            //update current ship and notify player of next placement
                            currentShip = player.shipsToPlace[0]
                            this.changeFooterText(
                                `Now place your ${currentShip.title}. (${currentShip.length} slots)`
                            )
                        }
                    }
                })
            }
        })
    }

    coverBoard(board) {
        const boardCover = document.createElement('div')
        const boardRect = board.getBoundingClientRect()

        boardCover.id = 'cover'

        //Set dimensions and position
         boardCover.style.width = `${boardRect.width*1.05}px`
         boardCover.style.height = `${boardRect.height*1.05}px`
         boardCover.style.top = `${boardRect.top}px`
         boardCover.style.left = `${boardRect.left}px`

         document.body.appendChild(boardCover)

    }

    removeCoverBoard() {
        let boardToRemove = document.getElementById('cover')
        document.body.removeChild(boardToRemove)
    }
}
