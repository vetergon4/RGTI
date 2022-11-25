var path = require("path");
var obj2json = require("obj2json");
const { mainModule } = require("process");
// NOTE: The module can detect standard install locations for Blender on Linux
// and OS X, but also accepts a `blenderPath` option to provide a non-standard path
var opts = {
    inputFile: path.join(__dirname, "tower.obj"),
    outputFile: path.join(__dirname, "circle2.json")
};

function main() {

    obj2json(opts, function(err, outputFilePath) {
        if (err) {
            console.error("ERROR:", err);
        }
        else {
            console.log("Output file at:", outputFilePath);
    }
});
}

main()
