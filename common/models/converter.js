const objToJson = require('obj-file-parser');
const fs = require('fs');

let path = '';
if (process.argv.length > 2) {
    path = process.argv[2];
    console.log(path);
    if (path.endsWith('.obj')) {
        throw new Error('Do not include the file suffix');
    }
}
else
    throw new Error('No path provided as argument');

fs.readFile(`${path}.obj`, 'utf-8', (err, data) => {
    if (err)
        throw err;
    const objFile = new objToJson(data);
    const parsed = objFile.parse();
    let output = {
        vertices: [],
        normals: [],
        texcoords: [],
        indices: []
    };
    const vertices = parsed['models'][0]['vertices'];
    for (const vertice of vertices) {
        output['vertices'].push(vertice['x']);
        output['vertices'].push(vertice['y']);
        output['vertices'].push(vertice['z']);
    }
    const normals = parsed['models'][0]['vertexNormals'];
    for (const normal of normals) {
        output['normals'].push(normal['x']);
        output['normals'].push(normal['y']);
        output['normals'].push(normal['z']);
    }
    const texcoords = parsed['models'][0]['textureCoords'];
    for (const texcoord of texcoords) {
        output['texcoords'].push(texcoord['u']);
        output['texcoords'].push(texcoord['v']);
    }
    const faces = parsed['models'][0]['faces'];
    for (const face of faces) {
        const indices = face['vertices'];
        for (const indice of indices) {
            output['indices'].push(indice['vertexIndex']);
        }
    }
    fs.writeFile(`${path}.json`, JSON.stringify(output), err => {
        if (err)
            throw err;
    });
});