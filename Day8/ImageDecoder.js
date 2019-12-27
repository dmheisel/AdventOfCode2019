const fs = require('fs')

class Decoder {
    constructor(file, height, width) {
        this._file = file;
        this._data = file && this.processFile(file)
        this._height = height;
        this._width = width;
    }

    processFile(file) {
        const data = fs.readFileSync(file, 'utf8').split("")
        return data;
    }

    buildLayers(data = this.data) {
        let image = []
        // console.log(data)
        while (data.length > 0) {
            let layer = [];
            while (layer.length < this.height) {
                layer.push(data.splice(0, this.width))
            }
            image.push(layer);
            counter ++
        }
        return image
    }
    reportDigitCounts(image) {
        let report = []
        image.forEach((layer, index) => {
            report[index] = {}
            layer.flat().forEach(digit => {
                report[index][digit] = layer.flat().filter(dig => digit === dig).length
            })
        })
        return report
    }

    buildImage(layers) {
        let image = layers[0].map((row, rowIndex) => row.map((digit, digitIndex) => {
            let check = 0;
            while (digit === "2" && check < layers.length) {
                check++;
                digit = layers[check][rowIndex][digitIndex]
            }
            return digit
        }))
        let response = image.map(row => row.join("")).join("\n")
        return response
        // return image
    }

    get file() {
        return this._file
    }
    get data() {
        return this._data
    }
    get height() {
        return this._height
    }
    get width() {
        return this._width
    }
    set height(newHeight) {
        this._height = newHeight
    }
    set width(newWidth) {
        this._width = newWidth;
    }
}

const decoder = new Decoder('Day8/input.txt', 6, 25)
const layers = decoder.buildLayers() 
// console.log(image)
const report = decoder.reportDigitCounts(layers)
// console.log(report)

report.sort((a, b) => a["0"] - b["0"]);
// console.log(report)
const image = decoder.buildImage(layers)
console.log(image)