const fs = require('fs')

class MapComputer {
    constructor(file = null) {
        this.file = file
        this.data = file !== null && this.processInputFile(file)
    }

    processInputFile(file) {
        let data = fs.readFileSync(file, "utf8");
        return data.split("\n");
    }

}

const mapComputer = new MapComputer('Day6/input.txt')



console.log(mapComputer.data)