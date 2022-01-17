import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/particle.child.shader.js'

export default class{
    constructor({group}){
        this.param = {
            count: 1000,
            color: 0xffffff,
            opacity: 1,
            size: 10
        }

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
    }


    // create
    create(group){
        this.object = new Particle({count: this.param.count, posVelocity: {x: 0, y: 1, z: 0}, lifeVelocity: 0.05, materialOpt: {
            vertexShader: Shader.vertex,
            fragmentShader: Shader.fragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uSize: {value: this.param.size}
            }
        }})

        this.object.setAttribute('aOpacity', new Float32Array(Array.from({length: this.count}, () => this.param.opacity)), 1)

        group.add(this.object.get())
    }


    // animate
    animate(){
        // const {posVelocity, lifeVelocity, life} = this.object
        // const position = this.object.getAttribute('position')
        // const opacity = this.object.getAttribute('aOpacity')
        // const positionArr = position.array
        // const opacityArr = opacity.array

        // const time = window.performance.now()

        // for(let i = 0; i < this.param.count; i++){
        //     const idx = i * 3

        //     const ox = positionArr[idx]
        //     const oz = positionArr[idx + 2]

        //     life[i] -= lifeVelocity
        //     opacityArr[i] = life[i]

        //     const n1 = SIMPLEX.noise3D(ox * 0.01, oz * 0.01, time * 0.001)
        //     const n2 = SIMPLEX.noise3D(ox * 0.02, oz * 0.02, time * 0.001)

        //     const nx = n1 * 100
        //     const nz = n2 * 100

        //     if(life[i] < 0){
        //         positionArr[idx] = 0
        //         positionArr[idx + 1] = 0
        //         positionArr[idx + 2] = 0
        //         life[i] = 1
        //     }else{
        //         positionArr[idx] = nx
        //         positionArr[idx + 1] += posVelocity[i].y
        //         positionArr[idx + 2] = nz
        //     }
        // }

        // position.needsUpdate = true
        // opacity.needsUpdate = true
    }
}