const IntcodeComputer = require('../Day5/IntcodeComputer')

class AmpController {
    constructor(file, numOfAmps = 5) {
        this.file = file,
            this.numOfAmps = numOfAmps;
        
    };

    runPhases(settings) {
        let output = 0
        settings.forEach((setting, index) => {
            let amp = new IntcodeComputer(this.file, [setting, output]);
            amp.run()
            output = amp.output
        })
        return output
    }

    calcOptimalPhase(numOfAmps = this.numOfAmps) {
        let possiblePhases = Array(numOfAmps).fill("").map((_, i) => i);

        //permutation function from stackoverflow: https://stackoverflow.com/a/40655572
        const permutation = (array) => {
            const result = [];
            function p(array, temp) {
                if (!array.length) {
                    result.push(temp);
                }
                for (let i = 0; i < array.length; i++) {
                    let x = array.splice(i, 1)[0];
                    p(array, temp.concat(x));
                    array.splice(i, 0, x);
                }
            }
            p(array, []);
            return result;
        }

        const permutations = permutation(possiblePhases)
        let optimalSettings = permutations.sort((a, b) => this.runPhases(b) - this.runPhases(a))[0]
        return optimalSettings
    }

}

const ampController = new AmpController('Day7/input.txt', 5)
// ampController.runPhases([1, 0, 4, 3, 2])
let settings = ampController.calcOptimalPhase()
console.log(ampController.runPhases(settings))