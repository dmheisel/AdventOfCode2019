class Moon {
    constructor(name, position = null, velocity = null) {
        this._name = name;
        this._position = position || {x: 0, y: 0, z: 0}
        this._velocity = velocity || {x: 0, y: 0, z: 0}
    }
    //apply the moons velocity to update its current position - done on each time tick in system.
    applyVelocity() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
    }
    //updates velocity with new values -- given from gravity calculations.
    updateVelocity(newVelocity) {
        this.velocity.x += newVelocity.x;
        this.velocity.y += newVelocity.y;
        this.velocity.z += newVelocity.z;
    }

    //energy calculations - could combine into one? left separate in case pot or kin energy is every needed
    calculatePotentialEnergy() {
        const position = this.position;
        return Math.abs(position.x) + Math.abs(position.y) + Math.abs(position.z)
    }
    calculateKineticEnergy() {
        const velocity = this.velocity;
        return Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z)
    }
    calculateTotalEnergy() {
        return this.calculatePotentialEnergy() * this.calculateKineticEnergy()
    }

    //getters and setters
    get name() {
        return this._name
    }
    get position() {
        return this._position
    }
    get velocity() {
        return this._velocity
    }
    set position(newPosition) {
        this._position = newPosition
    }
    set velocity(newVelocity) {
        this._velocity = newVelocity
    }

}

module.exports = Moon