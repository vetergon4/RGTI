import { GUI } from './lib/dat.gui.module.js';

import { Application } from './common/engine/Application.js';
import { mat4, vec3 } from './lib/gl-matrix-module.js';
import { Renderer } from './Renderer.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { SceneLoader } from './SceneLoader.js';
import { SceneBuilder } from './SceneBuilder.js';
import { Node } from './Node.js';
import { Model } from './Model.js';
import { WebGL } from './common/engine/WebGL.js';
import { shaders } from './shaders.js';


class App extends Application {

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;


        this.program = WebGL.buildPrograms(gl, shaders);

        this.root = new Node();
       
        this.offsetX = 0;
        this.offsetY = 0;
        this.offsetZ = 0;
        this.prekoracil = false;

        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.mvpMatrix = mat4.create();

        this.models = [];

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
            if (node instanceof Model) {
                node.program = WebGL.buildPrograms(gl, shaders);
                console.log(node.image);
                if(node.mesh == "./common/models/coin.json"){
                    console.log("Spawn kovanec");
                    this.models.push(node);
                }
                
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



        for (let i = 0; i < this.models.length; i++) {
            
            let t = this.models[i].transform;
            mat4.rotateX(t, t, 0.005);
            mat4.rotateY(t, t, 0.007);   
            /* let translation = vec3.create();
            vec3.set(translation, this.offsetX, 0, 0);
            mat4.translate(t, t, translation); */  
        }

        if (this.camera) {
            this.camera.update(dt);
        }

        if (this.physics) {
            this.physics.update(dt);
        }
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera);
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
    gui.add(app, 'enableCamera'); 
    await app.init()
});
