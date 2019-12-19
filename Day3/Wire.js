class Wire {
    constructor(steps) {
        this.steps = steps
        this.segments = this.calcSegments(steps)
    }
    
    calcSegments = (steps) => {
        let startPoint = [0, 0]
        return steps.map(step => {
            let segment = this.newSegment(step, startPoint)
            startPoint = segment[1]
            return segment
        })
    }

    newSegment(step, startPoint = [0, 0]) {
        let direction = step[0]
        let length = Number(step.slice(1))
        let changeIndex = direction === "R" || direction === "L" ? 0 : 1;
        let endPoint = [...startPoint];
        direction === "R" || direction === "U" ? endPoint[changeIndex] += length : endPoint[changeIndex] -= length;
        return [startPoint, endPoint]
    }
}

module.exports = Wire


// const wire = new Wire(["D8", "R4", "U2", "R16", "D123"])
// console.log(wire.segments)
// const segment = wire.newSegment(wire.steps[0], [2,2])

