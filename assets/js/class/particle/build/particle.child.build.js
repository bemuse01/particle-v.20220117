import * as THREE from '../../../lib/three.module.js'
import Particle from '../../objects/particle.js'
import Shader from '../shader/particle.child.shader.js'
// import PublicMethod from '../../../method/method.js'
import {GPUComputationRenderer} from '../../../lib/GPUComputationRenderer.js'
import GPGPUVariable from '../../objects/gpgpuVariable.js'

export default class{
    constructor({group, renderer}){
        this.param = {
            w: 100,
            h: 500,
            div: 0.05,
            color: 0xffffff,
            opacity: 1,
            size: 2,
            rd: 0.5
        }

        this.count = this.param.w * this.param.h

        this.gpuCompute = new GPUComputationRenderer(this.param.w, this.param.h, renderer)

        this.init(group)
    }


    // init
    init(group){
        this.initGPGPU()
        this.create(group)
    }


    // gpgpu
    initGPGPU(){
        this.createVariable()
        this.setVariable()

        this.gpuCompute.init()
    }
    createVariable(){
        this.createPositionVariable()
    }
    createPositionVariable(){
        const {texture, staticPosition} = this.createPositionTexture()

        this.positionVariable = new GPGPUVariable({
            gpuCompute: this.gpuCompute,
            texture,
            textureName: 'tPosition',
            shader: Shader.position,
            uniforms: {
                uTime: {value: null},
                uRand: {value: null},
                uLifeVelocity: {value: 0.01},
                staticPosition: {value: staticPosition}
            }
        })
    }
    createPositionTexture(){
        const texture = this.gpuCompute.createTexture()
        const {data, width, height} = texture.image

        const staticPosition = new Float32Array(width * height * 4)
        
        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // position x
                data[index + 0] = Math.random() * 0.2 - 0.1
                // position y
                data[index + 1] = Math.random() * 0.2 - 0.1
                // position z
                data[index + 2] = Math.random() * 0.2 - 0.1
                // life
                data[index + 3] = Math.random()

                staticPosition[index + 0] = THREE.Math.randFloat(0.005, 0.01)
                staticPosition[index + 1] = 0
                staticPosition[index + 2] = 0
                staticPosition[index + 3] = 0
            }
        }

        return {texture, staticPosition: new THREE.DataTexture(staticPosition, width, height, THREE.RGBAFormat, THREE.FloatType)}
    }
    setVariable(){
        this.positionVariable.setDependencies()
    }

        

    // create
    create(group){
        this.object = new Particle({
            count: this.count, 
            materialOpt: {
                vertexShader: Shader.draw.vertex,
                fragmentShader: Shader.draw.fragment,
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uColor: {value: new THREE.Color(this.param.color)},
                    uSize: {value: this.param.size},
                    uOpacity: {value: this.param.opacity},
                    tPosition: {value: null}
                }
            }
        })

        const {uv} = this.createAttribute()

        this.object.setAttribute('uv', new Float32Array(uv), 2)
        // this.object.setAttribute('aOpacity', new Float32Array(Array.from({length: this.count}, () => 1)), 1)

        group.add(this.object.get())
    }
    createAttribute(){
        const uv = []

        for(let i = 0; i < this.param.w; i++){
            for(let j = 0; j < this.param.h; j++){
                uv.push(i / this.param.w, j / this.param.h)
            }
        }

        return {uv}
    }


    // animate
    animate(){
        this.gpuCompute.compute()

        const time = window.performance.now()

        this.positionVariable.setUniform('uTime', time)
        this.positionVariable.setUniform('uRand', Math.random())

        this.object.setUniform('tPosition', this.gpuCompute.getCurrentRenderTarget(this.positionVariable.get()).texture)
    }
}