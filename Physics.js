import { vec3, mat4 } from './lib/gl-matrix-module.js';
import { Camera } from './Camera.js';
import  Functions  from './Functions.js';
export class Physics {

    constructor(scene) {
        this.scene = scene;
        this.funct = new Functions(this.scene);
        this.disableGravity = false;
        this.allowBind = false; // dovoli izklucitev gravitacije
    }

    update(dt, binded, camera) {
        let allowBind = this.false
        let minDist = 10000;

        this.scene.traverse(node => {
            if (node.velocity) {
                vec3.scaleAndAdd(node.translation, node.translation, node.velocity, dt);
                node.updateTransform();
                this.scene.traverse(other => {
                    if (node !== other) {
                        if(this.resolveCollision(node, other)){
                            camera.onGround = true;
                        }
                    }
                });
            }
            // preveri ce smo v blizini vrvi
            if(node.id == "rope") { 
                if(binded) {
                    const dist = this.funct.calculateDistance(node, camera);
                    if (dist < minDist) {
                        minDist = dist
                    } //- node.scale[3]*2 )
                    if(dist < 5){
                        allowBind = true;
                    }
                    //else {
                    //    this.allowBind = false;
                    //}
                }
                //else{
                //    this.allowBind = false;
                //}
            }

            if(node.id =="coin"){

            }
            
        });
        //console.log(minDist, allowBind)
        if (allowBind) this.allowBind = true;
        else this.allowBind = false
    }

    // TODO - swing physics

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    resolveCollision(a, b) {
        
        // Update bounding boxes with global translation.
        const ta = a.getGlobalTransform();
        const tb = b.getGlobalTransform();

        const posa = mat4.getTranslation(vec3.create(), ta);
        const posb = mat4.getTranslation(vec3.create(), tb);

        const mina = vec3.add(vec3.create(), posa, a.aabb.min);
        const maxa = vec3.add(vec3.create(), posa, a.aabb.max);
        const minb = vec3.add(vec3.create(), posb, b.aabb.min);
        const maxb = vec3.add(vec3.create(), posb, b.aabb.max);

        // Check if there is collision.
        const isColliding = this.aabbIntersection({
            min: mina,
            max: maxa
        }, {
            min: minb,
            max: maxb
        });
        if (isColliding) {
            //console.log(b.image.outerHTML);
            
            //Ce zadanemo kovanec
            if(b.id == "coin"){

                let tocke = document.getElementById("stTock");
                let trenutne = parseFloat(tocke.innerHTML);
                trenutne += 1;
                tocke.innerHTML = parseInt(trenutne.toFixed(2));
    
                //Zvok ob pobiranju in kovanec izgine iz mape
                const zvok = document.getElementById("myAudio");
                zvok.pause();
                zvok.play();
                vec3.add(b.translation, b.translation, [200, 200, 200]);
                b.updateTransform();
            }
        }

        if (!isColliding) {
            return false;
        }

        // Move node A minimally to avoid collision.
        const diffa = vec3.sub(vec3.create(), maxb, mina);
        const diffb = vec3.sub(vec3.create(), maxa, minb);

        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        if (diffb[0] >= 0 && diffb[0] < minDiff) {
            minDiff = diffb[0];
            minDirection = [-minDiff, 0, 0];
        }
        if (diffb[1] >= 0 && diffb[1] < minDiff) {
            minDiff = diffb[1];
            minDirection = [0, -minDiff, 0];
        }
        if (diffb[2] >= 0 && diffb[2] < minDiff) {
            minDiff = diffb[2];
            minDirection = [0, 0, -minDiff];
        }

        vec3.add(a.translation, a.translation, minDirection);
        a.updateTransform();
        return true;
    }
}
