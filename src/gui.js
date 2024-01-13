export default class Gui {
    constructor() {
        this.p1Board = document.getElementById('p1Board')
        this.p2Board = document.getElementById('p2Board')
        this.footer = document.getElementById('footer')
        this.createGridSlots()
        this.p1BoardGridSlots = this.p1Board.children
        this.p2BoardGridSlots = this.p2Board.children
    }

    createRotationArrows() {

        const horizontalArrow = document.createElement('button')
        horizontalArrow.innerText = '→'
        horizontalArrow.classList.add('arrow')
        horizontalArrow.id = 'horizontalArrow'
        
        const verticalArrow = document.createElement('button')
        verticalArrow.innerText = '↑'
        verticalArrow.classList.add('arrow')
        verticalArrow.id = 'verticalArrow'

        const parent = document.getElementById('boardContainers')
        parent.appendChild(verticalArrow)
        parent.appendChild(horizontalArrow)


    }

    arrowRotation(player) {
        const horizontalArrow = document.getElementById('horizontalArrow')
        const verticalArrow = document.getElementById('verticalArrow')
        horizontalArrow.addEventListener('click', () => {
            player.board.orientation = 'left'
        })
        verticalArrow.addEventListener('click', () => {
            player.board.orientation = 'up'
        })
    }
    createGridSlots() {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        for (let i = 9; i >= 0; i--) {
            //Sets up 0 to be the bottom of the grid, 9 at the top
            for (let j = 0; j < 10; j++) {
                const p1GridSlot = document.createElement('div')
                p1GridSlot.id = `${alphabet[j]}${i}p1`
                p1GridSlot.classList.add('gridSlot')
                p1GridSlot.classList.add('p1GridSlot')
                this.p1Board.appendChild(p1GridSlot)

                const p2GridSlot = document.createElement('div')
                p2GridSlot.id = `${alphabet[j]}${i}p2`
                p2GridSlot.classList.add('gridSlot')
                p2GridSlot.classList.add('p2GridSlot')
                this.p2Board.appendChild(p2GridSlot)
            }
        }
    }

    changeFooterText(text) {
        this.footer.innerText = text
    }

    changeFooterTextAndConfirm(text) {
        this.footer.innerText = text
        return new Promise((resolve) => {
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

    removeAllListeners(slots) {
        for (let slot of slots) {
            const parent = slot.parentElement
            const replacement = slot.cloneNode(true)
            slot.id = undefined
            parent.replaceChild(replacement, slot)
        }
    }

    showShipPlacement(player) {
        this.arrowRotation(player)
        let currentShip = player.shipsToPlace[0]
        this.changeFooterText(
            `Now place your ${currentShip.title}. (${currentShip.length} slots)`
        )
        const currentGridSlots =
            player.name === 'Player 1'
                ? this.p1BoardGridSlots
                : this.p2BoardGridSlots
        return new Promise((resolve, reject) => {
            const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
            for (let slot of currentGridSlots) {
                const currentID = slot.id.substring(0, 2)
                const playerIDTag = slot.id.substring(2)
                let slotElementsFromIDS
                let slotIDsToHighlight
                slot.addEventListener('mouseover', (event) => {
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
                                    document.getElementById(
                                        `${slot + playerIDTag}`
                                    )
                                )
                            }
                        }
                        for (const slot of slotElementsFromIDS) {
                            slot.classList.add('highlight')
                        }
                    }
                })
                slot.addEventListener('mouseleave', (event) => {
                    // to undo the color change
                    for (const slot of slotElementsFromIDS) {
                        slot.classList.remove('highlight')
                    }
                })
                slot.addEventListener('click', (event) => {
                    if (
                        slotIDsToHighlight !== false &&
                        player.board.slotsMap[currentID].occupied === false
                    ) {
                        const parent = slot.parentElement
                        player.board.placeShip(currentShip, currentID, player.board.orientation)
                        this.addOccupiedToEachSlotsClass(slotElementsFromIDS)
                        slotElementsFromIDS.forEach((slot) => {
                            const replacement = slot.cloneNode(true)
                            slot.id = undefined
                            parent.replaceChild(replacement, slot)
                        })
                        player.shipsToPlace.shift()
                        if (player.shipsToPlace.length === 0) {
                            this.removeAllListeners(currentGridSlots)
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
        boardCover.style.width = `${boardRect.width * 1.01}px`
        boardCover.style.height = `${boardRect.height * 1.02}px`
        boardCover.style.top = `${boardRect.top}px`
        boardCover.style.left = `${boardRect.left}px`

        document.body.appendChild(boardCover)
    }

    hideShips(slots) {
        Array.from(slots).forEach((slot) => {
            slot.classList.add('hide')
        })
    }

    revealShips(slots) {
        Array.from(slots).forEach((slot) => {
            slot.classList.remove('hide')
        })
    }

    removeCoverBoard() {
        if (document.getElementById('cover')) {
            document.body.removeChild(document.getElementById('cover'))
        }
    }

    listenForAttack(slots, currentPlayer, otherPlayer) {
        console.log(`Listening for attack from ${currentPlayer.name}`)
        return new Promise((resolve) => {
            Array.from(slots).forEach((slot) => {
                slot.addEventListener('click', () => {
                    console.log('Clicked the slot!')
                    let slotID = slot.id.substring(0, 2)
                    let validAttack = currentPlayer.makeAttack(
                        otherPlayer.board,
                        slotID
                    )
                    let shipPresent =
                        otherPlayer.board.slotsMap[slotID].occupied
                    if (validAttack && shipPresent) {
                        slot.classList.add('hit')
                        this.changeFooterTextAndConfirm(
                            'You attacked and hit an enemy ship! (Click to continue)'
                        ).then(() => resolve(true))
                    } else if (validAttack && !shipPresent) {
                        slot.classList.add('attacked')
                        this.changeFooterTextAndConfirm(
                            'You attacked and missed! (Click to continue)'
                        ).then(() => resolve(true))
                    }
                })
                slot.addEventListener('mouseover', () => {
                    slot.classList.add('attackHover')
                })
                slot.addEventListener('mouseleave', () => {
                    slot.classList.remove('attackHover')
                })
            })
        })
    }

    takeTurn(currentPlayer, otherPlayer) {
        return new Promise((resolve) => {
            this.removeCoverBoard()
            this.changeFooterText(`${currentPlayer.name}, click on the enemy board to make an attack`)
            let currentBoard
            let currentPlayerSlots
            let otherPlayersSlots
            if (currentPlayer.name === 'Player 1') {
                //Player 1's turn
                currentBoard = this.p1Board
                currentPlayerSlots = this.p1BoardGridSlots
                otherPlayersSlots = this.p2BoardGridSlots
            } else {
                //Player 2's turn
                currentBoard = this.p2Board
                currentPlayerSlots = this.p2BoardGridSlots
                otherPlayersSlots = this.p1BoardGridSlots
            }
            this.hideShips(otherPlayersSlots)
            this.revealShips(currentPlayerSlots)
            this.listenForAttack(otherPlayersSlots, currentPlayer, otherPlayer)
                .then(() => {
                    this.removeAllListeners(otherPlayersSlots)
                    let playerWon = otherPlayer.board.shipsAllSunk()
                    console.log(playerWon)
                    if (playerWon) {
                        console.log('Running the win if statement')
                        this.changeFooterTextAndConfirm(
                            `${currentPlayer.name} wins!`
                        ).then(() => {
                            console.log('The game should be done now')
                            return resolve(true) //game ends
                        })
                    } else {
                        this.hideShips(currentPlayer)
                        this.coverBoard(currentBoard)
                        this.changeFooterTextAndConfirm(
                            `${currentPlayer.name}'s turn is over. Pass to ${otherPlayer.name} and click to continue.`
                        ).then(() => {
                            resolve(this.takeTurn(otherPlayer, currentPlayer)) //Loops around
                        })
                    }
                })
        })
    }
}
