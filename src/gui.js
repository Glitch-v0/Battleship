export default class Gui {
    constructor() {
        const p1Board = document.getElementById('p1Board')
        const p2Board = document.getElementById('p2Board')
    }

    createGridCells() {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        for (let i = 9; i >= 0; i--) {
            //Sets up 0 to be the bottom of the grid, 9 at the top
            for (let j = 0; j < 10; j++) {
                const p1GridCell = document.createElement('button')
                const p2GridCell = document.createElement('button')
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
}
