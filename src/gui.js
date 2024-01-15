import Player from './player'

export default class Gui {
    constructor() {
        this.p1Board = document.getElementById('p1Board')
        this.p2Board = document.getElementById('p2Board')
        this.footer = document.getElementById('footer')
        this.p1BoardGridSlots = this.p1Board.children
        this.p2BoardGridSlots = this.p2Board.children
        this.p1
        this.p2
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
            player.board.orientation = 'right'
        })
        verticalArrow.addEventListener('click', () => {
            player.board.orientation = 'up'
        })
    }

    removeArrows() {
        const arrow1 = document.getElementById('horizontalArrow')
        const arrow2 = document.getElementById('verticalArrow')
        arrow1.remove()
        arrow2.remove()
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

    removeGridSlots() {
        const slots = document.getElementsByClassName('gridSlot')
        Array.from(slots).forEach((slot) => {
            slot.remove()
        })
    }

    changeFooterText(text) {
        this.footer.innerText = text
    }

    changeFooterTextAndConfirm(text) {
        this.footer.innerText = text
        return new Promise((resolve) => {
            this.footer.addEventListener(
                'click',
                () => {
                    resolve()
                },
                { once: true }
            )
            document.body.addEventListener(
                'keydown',
                () => {
                    resolve()
                },
                { once: true }
            )
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

    removeListener(obj) {
        const parent = obj.parentElement
        const replacement = obj.cloneNode(true)
        obj.id = undefined
        parent.replaceChild(replacement, obj)
    }

    playHumanOrComputer() {
        // Initializing players and the board slots for new game
        this.p1 = new Player(false, 'Player 1')
        this.p2 = new Player(false, 'Player 2')
        this.removeGridSlots()
        this.createGridSlots()
        this.p1BoardGridSlots = this.p1Board.children
        this.p2BoardGridSlots = this.p2Board.children
        this.createRotationArrows()

        this.changeFooterText(
            'Welcome to Battleship! Click one of the boxes to play against a computer or pass and play with a friend.'
        )
        const welcomeDialog = document.createElement('dialog')
        welcomeDialog.id = 'welcomeDialog'

        const playComputerButton = document.createElement('button')
        playComputerButton.id = 'playComputerButton'
        playComputerButton.className = 'gameModeButton'
        playComputerButton.innerText = 'Play against a computer'

        const playHumanButton = document.createElement('button')
        playHumanButton.id = 'playHumanButton'
        playHumanButton.className = 'gameModeButton'
        playHumanButton.innerText = 'Pass and play with a friend'

        welcomeDialog.style.width = '90vw'
        welcomeDialog.style.height = '90vh'
        welcomeDialog.style.backgroundColor = 'black'

        document.body.appendChild(welcomeDialog)
        welcomeDialog.append(playComputerButton, playHumanButton)
        welcomeDialog.showModal()

        playComputerButton.addEventListener('click', () => {
            console.log('Play computer mode!')
            this.computerIntroSetup()
            welcomeDialog.close()
        })
        playHumanButton.addEventListener('click', () => {
            console.log('Play human mode!')
            this.humanIntroSetup()
            welcomeDialog.close()
        })
    }

    humanIntroSetup() {
        this.showShipPlacement(this.p1)
            .then(() => this.coverBoard(this.p1Board))
            .then(() =>
                this.changeFooterTextAndConfirm(
                    `CHANGE: Now let ${this.p2.name} place ships. Click this message to continue.`
                )
            )
            .then(() => this.showShipPlacement(this.p2))
            .then(() => this.hideShips(this.p2BoardGridSlots))
            .then(() =>
                this.changeFooterTextAndConfirm(
                    `CHANGE: The game is about to begin. It is now ${this.p1.name}'s turn. Click this message to continue.`
                )
            )
            .then(() => {
                this.removeArrows()
                this.removeCoverBoard()
            })
            .then(() => this.humanTakeTurnAgainstHuman(this.p1, this.p2))
    }

    computerIntroSetup() {
        this.showShipPlacement(this.p1)
            .then(() => this.computerPlaceShips())
            .then(() =>
                this.changeFooterTextAndConfirm(
                    `The computer has placed the ships. Click this message to continue.`
                )
            )
            // .then(() => this.hideShips(this.p2BoardGridSlots))
            .then(() => {
                this.removeArrows()
            })
            .then(() => this.takeTurnAgainstComputer())
    }

    computerPlaceShips() {
        const directions = ['up', 'down', 'left', 'right']
        while (this.p2.shipsToPlace.length !== 0) {
            // computer still has ships to place
            let currentShip = this.p2.shipsToPlace[0]
            let randomlyChosenSlot = this.p2.board.getRandomSlotKey()
            this.p2.board.orientation =
                directions[Math.floor(Math.random() * directions.length)]
            let currentID = randomlyChosenSlot.substring(0, 2)
            let slotIDsToHighlight = this.p2.board.selectSlots(
                //only sets value INITIALLY, but NOT after placing a ship. returns an array or false
                currentID,
                currentShip.length
            )
            let slotElementsFromIDS = []
            if (
                slotIDsToHighlight !== false &&
                this.p2.board.slotsMap[currentID].occupied === false
            ) {
                for (const slot of slotIDsToHighlight) {
                    // convert returned id's to actual html elements
                    slotElementsFromIDS.push(
                        document.getElementById(`${slot + 'p2'}`)
                    )
                }
                this.p2.board.placeShip(
                    currentShip,
                    currentID,
                    this.p2.board.orientation
                )
                this.addOccupiedToEachSlotsClass(slotElementsFromIDS)
                this.p2.shipsToPlace.shift()
                if (this.p2.shipsToPlace.length === 0) {
                    this.removeAllListeners(this.p2BoardGridSlots)
                    return true
                }
            }
        }
    }

    showShipPlacement(player) {
        let currentBoard //visual help player see which board is theirs
        if (player.name === 'Player 1') {
            currentBoard = this.p1Board
        } else {
            currentBoard = this.p2Board
        }
        currentBoard.style.border = '2px solid rgb(0, 102, 255)'

        this.arrowRotation(player) // enables current player to rotate ship during placement
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
                        player.board.placeShip(
                            currentShip,
                            currentID,
                            player.board.orientation
                        )
                        this.addOccupiedToEachSlotsClass(slotElementsFromIDS)
                        slotElementsFromIDS.forEach((slot) => {
                            const replacement = slot.cloneNode(true)
                            slot.id = undefined
                            parent.replaceChild(replacement, slot)
                        })
                        player.shipsToPlace.shift()
                        if (player.shipsToPlace.length === 0) {
                            currentBoard.style.border = 'none'
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
        return new Promise((resolve) => {
            let otherPlayerSlots
            if (currentPlayer.name === 'Player 1') {
                otherPlayerSlots = this.p2BoardGridSlots
            } else {
                otherPlayerSlots = this.p1BoardGridSlots
            }
            Array.from(slots).forEach((slot) => {
                slot.addEventListener('click', () => {
                    let slotID = slot.id.substring(0, 2)
                    let validAttack = currentPlayer.makeAttack(
                        otherPlayer.board,
                        slotID
                    )
                    let shipPresent =
                        otherPlayer.board.slotsMap[slotID].occupied
                    if (validAttack && shipPresent) {
                        // Attack hit
                        otherPlayer.board.ships.forEach((ship) => {
                            if (ship.slots.includes(slotID)) {
                                //to only apply actions to the one ship
                                if (ship.isSunk()) {
                                    //Sunk or just a hit
                                    slot.classList.add('hit')
                                    this.changeFooterTextAndConfirm(
                                        `You sank ${otherPlayer.name}'s ${ship.title}! (Click to continue)`
                                    ).then(() => resolve(true))
                                } else {
                                    slot.classList.add('hit')
                                    this.changeFooterTextAndConfirm(
                                        'You attacked and hit an enemy ship! (Click to continue)'
                                    ).then(() => resolve(true))
                                }
                                this.removeAllListeners(otherPlayerSlots) //stops multiple attacks in one turn
                            }
                        })
                    } else if (validAttack && !shipPresent) {
                        // Attack missed
                        slot.classList.add('attacked')
                        this.removeAllListeners(otherPlayerSlots) //stops multiple attacks in one turn
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

    humanTakeTurnAgainstHuman(currentPlayer, otherPlayer) {
        return new Promise((resolve) => {
            this.removeCoverBoard()
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
            this.listenForAttack(
                otherPlayersSlots,
                currentPlayer,
                otherPlayer
            ).then(() => {
                this.removeAllListeners(otherPlayersSlots)
                let playerWon = otherPlayer.board.shipsAllSunk()
                if (playerWon) {
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
                        resolve(
                            this.humanTakeTurnAgainstHuman(
                                otherPlayer,
                                currentPlayer
                            )
                        ) //Loops around
                    })
                }
            })
        })
    }

    takeTurnAgainstComputer() {
        return new Promise((resolve) => {
            this.changeFooterText(`Click on the enemy board to make an attack`)
            this.listenForAttack(this.p2BoardGridSlots, this.p1, this.p2).then(
                () => {
                    let playerWon = this.p2.board.shipsAllSunk()
                    if (playerWon) {
                        this.changeFooterTextAndConfirm(
                            `${this.p1.name} wins! Click here or press any key to start a new game`
                        ).then(() => {
                            return resolve(this.playHumanOrComputer()) //game ends
                        })
                    } else {
                        resolve(this.computerTakeTurnAgainstHuman()) //Loops around
                    }
                }
            )
        })
    }

    computerAttack() {
        return new Promise((resolve) => {
            let randomIndex = Math.floor(
                Math.random() * this.p2.unAttackedCoordinates.length
            )
            let randomCoordinate = this.p2.unAttackedCoordinates[randomIndex]
            let randomSlot = document.getElementById(randomCoordinate + 'p1')
            let validAttack = this.p2.makeAttack(
                this.p1.board,
                randomCoordinate
            )
            let shipPresent = this.p1.board.slotsMap[randomCoordinate].occupied
            if (validAttack && shipPresent) {
                // Attack hit
                this.p1.board.ships.forEach((ship) => {
                    if (ship.slots.includes(randomCoordinate)) {
                        randomSlot.classList.add('hit')
                        //to only apply actions to the one ship
                        if (ship.isSunk()) {
                            //Sunk or just a hit
                            this.changeFooterTextAndConfirm(
                                `${this.p2.name} sank your ${ship.title}! (Click to continue and start your turn)`
                            ).then(() => resolve(true))
                        } else {
                            this.changeFooterTextAndConfirm(
                                `${this.p2.name} hit your ${ship.title}. (Click to continue and start your turn)`
                            ).then(() => resolve(true))
                        }
                    }
                })
            } else if (validAttack && !shipPresent) {
                // Attack missed
                randomSlot.classList.add('attacked')
                this.changeFooterTextAndConfirm(
                    `${this.p2.name} attacked and missed! (Click to continue and start your turn)`
                ).then(() => resolve(true))
            }
        })
    }

    computerTakeTurnAgainstHuman() {
        this.computerAttack().then((resolve) => {
            let playerWon = this.p1.board.shipsAllSunk()
            if (playerWon) {
                this.changeFooterTextAndConfirm(
                    `${this.p2.name} sunk all your ships! You lose. Click here or press any key to start a new game`
                ).then(() => {
                    return resolve(this.playHumanOrComputer()) //game ends
                })
            } else {
                this.takeTurnAgainstComputer() //Loops around
            }
        })
    }
}
