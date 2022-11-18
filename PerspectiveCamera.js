import { mat4 } from '../../lib/gl-matrix-module.js';

import { Camera } from './Camera.js';

export class PerspectiveCamera extends Camera {

    constructor(options = {}) {
        super(options);

        this.aspect = options.aspect || 1.5;
        this.fov = options.fov || 1.5;
        this.near = options.near || 1;
        this.far = options.far || Infinity;

        this.updateMatrix();
    }

    updateMatrix() {
        console.log(this.matrix)
        console.log(this.fov)
        console.log(this.aspect)
        console.log(this.near)
        console.log(this.far)
        mat4.perspective(this.matrix,
            this.fov, this.aspect,
            this.near, this.far);
    }

}
