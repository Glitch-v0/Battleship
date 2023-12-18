import Ship from '../src/ship'

test('new ship prperties successfully created', () => {
    let carrier = new Ship(5)
    expect(carrier.length).toBe(5)
    expect(carrier.hits).toBe(0)
    expect(carrier.sunk).toBe(false)
})
