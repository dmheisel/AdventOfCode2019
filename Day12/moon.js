class Moon {
    constructor(name, position = null, velocity = null) {
        this._name = name;
        this._position = position || {x: 0, y: 0, z: 0}
        this._velocity = velocity || {x: 0, y: 0, z: 0}
    }

    applyVelocity() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
    }
    updateVelocity(newVelocity) {
        this.velocity.x += newVelocity.x;
        this.velocity.y += newVelocity.y;
        this.velocity.z += newVelocity.z;
    }
    calculatePotentialEnergy() {
        const position = this.position;
        return Math.abs(position.x) + Math.abs(position.y) + Math.abs(position.z)
    }

    
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