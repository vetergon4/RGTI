import { vec3, mat4 } from './lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';


export class Camera extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.inWater = false;
        
        this.projection = mat4.create();
        this.updateProjection();
        this.binded = false; // boolean ce drzimo vrv

        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};

    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    update(dt, binded) {
        const c = this;
        c.maxSpeed = Math.max(c.maxSpeed, 10)
        if(c.translation[1] == 1){
            c.onGround = true;
        } 
        const forward = vec3.set(vec3.create(),
            -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));
        const up = vec3.set(vec3.create(), 0, 2, 0);
        const gravity = vec3.set(vec3.create(), 0, 0.2, 0);
        //console.log("Can i bind", binded)

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
            if(binded){
                //console.log("TURBO SPEED")
                vec3.add(acc, acc, forward);
                vec3.add(acc, acc, forward);
                vec3.add(acc, acc, forward);
            }
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
            if(binded){
                vec3.sub(acc, acc, forward);
                vec3.sub(acc, acc, forward);
                vec3.sub(acc, acc, forward);
            }
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
            if(binded){
                vec3.add(acc, acc, right);
                vec3.add(acc, acc, right);
                vec3.add(acc, acc, right);
            }
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
            if(binded){
                vec3.sub(acc, acc, right);
                vec3.sub(acc, acc, right);
                vec3.sub(acc, acc, right);
            }
        }
        if (this.keys['Space'] && c.onGround) {
            c.velocity[1] = 20;
            c.onGround = false;
        }
        if (c.translation[1] > 0.90 && !binded) {
            vec3.sub(acc, acc, up);
        }
        if(this.keys['KeyQ']){
            this.binded = true; // prijema vrv
        }
        if(!this.keys['KeyQ']){
            
            this.binded = false;
        }
        //c.translation[1] = Math.max(c.translation[1], 0);

        

        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            c.velocity[0] = c.velocity[0] * (1-c.friction)
            c.velocity[2] = c.velocity[2] * (1-c.friction)
        }

        // 4: limit speed
        /*const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
        */
        const len = Math.hypot(c.velocity[0], c.velocity[2])
        if (len > c.maxSpeed && !binded) {
            c.velocity[0] *= c.maxSpeed / len
            c.velocity[2] *= c.maxSpeed / len
        }
        //console.log("x:", c.translation[0], "y:", c.translation[1], "z:", c.translation[2]);
    }


    enable() {
        document.addEventListener('mousemove', this.mousemoveHandler);
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);

    }

    disable() {
        document.removeEventListener('mousemove', this.mousemoveHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    mousemoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;        
        const c = this;

        c.rotation[0] -= dy * c.mouseSensitivity;
        c.rotation[1] -= dx * c.mouseSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.rotation[0] > halfpi) {
            c.rotation[0] = halfpi;
        }
        if (c.rotation[0] < -halfpi) {
            c.rotation[0] = -halfpi;
        }

        c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}

Camera.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 1.5,
    friction         : 0.2,
    acceleration     : 20,
    onGround         : true,
    swingSpeed       : 10
};
