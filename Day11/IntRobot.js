const Intcode = require("../Day9/Intcode");
//direction facings
const N = 0;
const E = 1;
const S = 2;
const W = 3;

//colors
const Black = 0;
const White = 1;

class Robot {
	constructor(instructions) {
		// const settings = { file: null, input: 0, inFeedbackMode: true}
		this.computer = new Intcode("Day11/input.txt", 1, true);
		this.currentLocation = [0, 0];
        this.history = {};
        this.facing = N;
	}
	run() {
		while (!this.computer.paused) {
			if (this.computer.paused) {
				break;
			}
			let colorInstruction = robot.computer.run().shift();
			let directionInstruction = robot.computer.run().shift();
			this.paint(colorInstruction);
            this.move(directionInstruction);
            let newColor = this.history[this.currentLocation] || Black
            this.computer.inputs.push(newColor)
        }
        return this.history
	}
	runLoop() {
		let colorInstruction = robot.computer.run().shift();
		let directionInstruction = robot.computer.run().shift();
		this.paint(colorInstruction);
		this.move(directionInstruction);
	}
    paint(instruction) {
        let color = instruction === 0 ? Black : White
        this.history[this.currentLocation] = color;
        
    }
    
	move(instruction) {
		//headings are N S E W
		// instruction of 0 means turn 90 degrees left and move one
		// instruction of 1 means turn 90 degrees right and move one
        //change facing based on instruction
        if (instruction === 0) {
			this.facing - 1 < N ? (this.facing = W) : (this.facing -= 1);
        } else {
			this.facing + 1 > W ? (this.facing = N) : (this.facing += 1);
        }
        //move robot along X or Y axis
		switch (this.facing) {
			case N:
				this.currentLocation[1] -= 1;
				break;
			case S:
				this.currentLocation[1] += 1;
				break;
			case E:
				this.currentLocation[0] += 1;
				break;
			case W:
				this.currentLocation[0] -= 1;
				break;
        }
    }
    printGrid() {
        let gridRows = Object.keys(this.history).map(coord => Number(coord.split(",")[0]))
        let gridCols = Object.keys(this.history).map(coord => Number(coord.split(",")[1]))
        let gridWidth = Math.abs(Math.min(...gridRows) + Math.max(...gridRows))
        let gridHeight = Math.abs(Math.min(...gridCols) + Math.max(...gridCols))
        let grid = []
        for (let i = 0; i <= gridHeight + 1; i++) {
            let row = [];
            for (let j = 0; j <= gridWidth + 1; j++) {
                row.push(".")
            }
            grid.push(row);
        }

        let coords = Object.keys(this.history).map(coord => {
            let newCoord = coord.split(",").map(el => Number(el))
            newCoord.push(this.history[coord])
            newCoord[0]
            newCoord[1]
            return newCoord;
        })
        coords.forEach(coord => {
            let row = coord[0]
            let col = coord[1]
            let color = coord[2]
            grid[col][row] = color === 0 ? "." : "#"
        })
        grid.forEach(row => console.log(row.join("")))
    }
}

const robot = new Robot();

robot.run()
robot.printGrid()