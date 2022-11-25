import { Application } from "./common/engine/Application.js";
import { vec3, mat4 } from "./lib/gl-matrix-module.js"
import { Renderer } from "./Renderer.js";
import { Physics } from "./Physics.js";
import { Camera } from "./Camera.js";
import { SceneLoader } from "./SceneLoader.js";
import { SceneBuilder } from "./SceneBuilder.js";
import { Node } from "./Node.js";
import { Model } from "./Model.js";
import { Mesh } from "./Mesh.js";

export default class Functions {
  constructor(scene) {
    this.scene = scene;
  }

  calculateDistance(node, camera){
    return vec3.distance(node.translation, camera.translation);
  }
}
