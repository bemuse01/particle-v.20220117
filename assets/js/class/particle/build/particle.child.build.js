import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/particle.child.shader.js'
import PublicMethod from '../../../method/method.js'

export default class{
    constructor({group}){
        this.param = {
            count: 20000,
            div: 0.2,
            color: 0xffffff,
            opacity: 1,
            size: 1
        }

        this.init(group)
    }


    // init
    init(group){
        this.create(group)
    }


    // create
    create(group){
        this.object = new Particle({count: this.param.count, lifeVelocity: {min: 0.01, max: 0.05}, materialOpt: {
            vertexShader: Shader.vertex,
            fragmentShader: Shader.fragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: {value: new THREE.Color(this.param.color)},
                uSize: {value: this.param.size}
            }
        }})

        this.object.setAttribute('aOpacity', new Float32Array(Array.from({length: this.param.count}, () => this.param.opacity)), 1)

        group.add(this.object.get())
    }


    // animate
    animate(){
        const {lifeVelocity} = this.object
        const position = this.object.getAttribute('position')
        const opacity = this.object.getAttribute('aOpacity')
        const positionArr = position.array
        const opacityArr = opacity.array

        const time = window.performance.now()
        const div = this.param.count * this.param.div

        for(let i = 0; i < this.param.count; i++){
            const idx = i * 3

            opacityArr[i] -= lifeVelocity[i]

            const n1 = SIMPLEX.noise2D(i % div * 0.001, time * 0.0005)
            const n2 = SIMPLEX.noise2D(i % div * 0.002, time * 0.0005)
            const n3 = SIMPLEX.noise2D(i % div * 0.003, time * 0.0005)

            const nx = n1 * 0.5
            const ny = PublicMethod.normalize(n2, 0, 1, -1, 1)
            const nz = n3 * 0.5

            positionArr[idx] += nx
            positionArr[idx + 1] += ny
            positionArr[idx + 2] += nz

            if(opacityArr[i] < 0){
                positionArr[idx] = 0
                positionArr[idx + 1] = 0
                positionArr[idx + 2] = 0
                opacityArr[i] = 1
            }
        }

        position.needsUpdate = true
        opacity.needsUpdate = true
    }
}