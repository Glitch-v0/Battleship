export default class Ship {
    constructor(length, slots, hits = 0, sunk = false) {
        this.length = length
        this.hits = hits
        this.sunk = sunk
        this.slots = slots
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
