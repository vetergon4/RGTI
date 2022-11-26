import { GUI } from './lib/dat.gui.module.js';

import { Application } from './common/engine/Application.js';
import { mat4, vec3 } from './lib/gl-matrix-module.js';
import { Renderer } from './Renderer.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { SceneLoader } from './SceneLoader.js';
import { SceneBuilder } from './SceneBuilder.js';
import Functions from './Functions.js';
import {Light} from './Light.js';
class App extends Application {

    start() {
        const gl = this.gl;
        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.inWater = false;
        this.startTime = this.time;
        this.aspect = 1;
        this.binded = false;
        this.light = new Light();
        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json');


    }

    async load(uri) {
        const gl = this.gl;
        const scene = await new SceneLoader().loadScene(uri);
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene);

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }

        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);

    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        
        if (this.camera) {
            this.camera.update(dt, this.binded);
            this.inWater = this.camera.inWater;
            console.log(this.inWater)
        }
        
        if (this.physics) {
            this.binded = this.camera.binded;
            this.physics.update(dt, this.binded, this.camera);
            this.binded = this.physics.allowBind;
        }

        
        
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera, this.light);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}


document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new GUI();
    let over = false;

    gui.add(app, 'enableCamera').onChange(function(){
        var timer = setInterval(function() {
            document.getElementById("time").innerHTML++;
            if(app.inWater && !over){
                alert("GAME OVER :(");
                over = true
                window.location.replace("menu.html");
            }
        }, 1000);
    });
    
    //gui.add(app, 'enableCamera'); 
    await app.init()
});


function generateLevel() {
    console.log()
}

function generatePole(translation_bottom, translation_top, id) {
    let pole_bottom =  {
        "type": "model",
        "mesh": 0,
        "id":`pole_bottom${id}`,
        "texture": 5,
        "aabb": {
          "min": [-1, -0.1, -1],
          "max": [1, 0.1, 1]
        },
        "translation": translation_bottom,
        "rotation": [1.5, 1.5, 0],
        "scale": [0.5, 0.5, 7]
      };

let pole_top = {
        "type": "model",
        "mesh": 0,
        "id": `pole_top${id}`,
        "texture": 5,
        "aabb": {
          "min": [-1, -0.1, -1],
          "max": [1, 0.1, 1]
        },
        "translation": translation_top,
        "rotation": [0, 1.5, 0],
        "scale": [0.5, 0.5, 6]
      };

    return [pole_bottom, pole_top]   
}

function generatePlatform(translation, id) {
    const p = {
        "type": "model",
        "mesh": 2,
        "id": "floor",
        "texture": 4,
        "aabb": {
          "min": [-10, -0, -5],
          "max": [10, 0, 5]
        },
        "translation": translation,
        "rotation": [0, 0, 0],
        "scale": [10, 0, 5]
      }
      return p;
    }

function generateRope(translation, id) {
    const rope = {
        "type": "model",
        "mesh": 0,
        "id": `rope${id}`,
        "texture": 6,
        "aabb": {
          "min": [
            -1,
            -0.1,
            -1
          ],
          "max": [
            1,
            0.1,
            1
          ]
        },
        "translation": translation,
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          0.1,
          3,
          0.1
        ]
      }
    return rope
}

console.log(generatePlatform([0, 0, -32]),3)
console.log(generatePole([0, 5, -32],[3,11,-32], 3))
console.log(generateRope([-3, 17, -20],2))
console.log(generateRope([3, 17, -20],2))
