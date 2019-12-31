const Moon = require('./moon')

test("Moon class instantiates correctly.", () => {
    const io = new Moon("Io")
    expect(io.name).toBe("Io")
    expect(io.position).toEqual({x: 0, y: 0, z: 0})
    expect(io.velocity).toEqual({x: 0, y: 0, z: 0})
})

test("Moon apply velocity increases position by adding values in its velocity to its position", () => {
    const io = new Moon("Io", null, { x: 1, y: 2, z: -1 })
    io.applyVelocity();
    expect(io.position).toEqual({ x: 1, y: 2, z: -1 })
} )

test("Moon update velocity function updates velocity by adding provided values", () => {
    const io = new Moon("Io", null, {x: 1, y: -1, z: 10})
    io.updateVelocity({ x: 3, y: 0, z: -2 })
    expect(io.velocity).toEqual({x: 4, y: -1, z: 8})
})
describe("Moon total energy calculations work correctly.", () => {
    test("Moon potential energy method provides total potential energy (sum of abs value of positions)", () => {
        const io = new Moon("Io", { x: -5, y: 17, z: -13 })
        expect(io.calculatePotentialEnergy()).toBe(35)
    })
    
})
