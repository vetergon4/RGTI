import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [0, 1, -3],
            color            : [255, 255, 255],
            intensity        : 1,                        // intenziteta barve
            attenuation      : [0.4, 0, 0.0001],         // Prvi parameter jakost svetlobe,  zadnji kako hitro upada glede na oddaljenost
            ambient          : 0.1

        });
    }

}