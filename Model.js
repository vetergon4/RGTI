import { Node } from './Node.js';

export class Model extends Node {

    constructor(mesh, image, options) {
        super(options);
        this.mesh = mesh;
        this.image = image;
        if(options.id){
            this.id = options.id;
        }
        if(options.name){
            this.name = options.name;
        }
    }

}
