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
    
    showShipPlacement(ship, player) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        for (const cell of this.p1BoardGridCells) {
            const slotIDsToHighlight = player.board.selectSlots(cell.id, ship.length)
            const slotElementsFromIDS = []
            cell.addEventListener("mouseover", (event) => {
                if (slotIDsToHighlight !== false) {
                    if (slotElementsFromIDS.length === 0) { // Only adds to array if array is empty
                        for (const slot of slotIDsToHighlight) {
                            // convert returned id's to actual html elements
                            slotElementsFromIDS.push(
                                document.getElementById(slot)
                            )
                        }
                    }
                    for (const slot of slotElementsFromIDS) {
                        slot.style.backgroundColor = 'rgb(0, 70, 127)'
                    }
                }
                console.log({slotElementsFromIDS})
            })
            cell.addEventListener('mouseleave', (event) => { // to undo the color change
                for (const slot of slotElementsFromIDS) {
                    slot.style.backgroundColor = 'rgb(0, 35, 63)'
                }
            })
            cell.addEventListener('click', (event) => {
                player.board.placeShip(ship, cell.id, 'up')
                this.changeFooterText(`Ships placed: ${player.board.ships.length}`)
            })
            }
        }
    }
    
