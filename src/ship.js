export default class Ship {
    constructor(length, slots, hits = 0, sunk = false, title = "ship") {
        this.length = length
        this.hits = hits
        this.sunk = sunk
        this.slots = slots
        this.title = title
    }

    hit() {
        this.hits += 1
    }

    isSunk() {
        if (this.hits >= this.length) {
            this.sunk = true
            return true
        }
        return false
    }
}
