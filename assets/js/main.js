import APP from './class/app/app.js'
import PARTICLE from './class/particle/particle.js'

new Vue({
    el: '#wrap',
    data(){
        return{
            objectModules: {
                app: APP,
                particle: PARTICLE
            },
        }
    },
    mounted(){
        this.init()
    },
    computed: {
        getElement(){
            return (name, child) => {
                if(!this.elements[name]) return []
                else return this.elements[name].get(child)
            }
        } 
    },
    methods: {
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            for(const module in this.objectModules){
                const instance = this.objectModules[module]
                
                OBJECT[module] = new instance(OBJECT)
            }
        },
        resizeThree(){
            for(const i in OBJECT){
                if(!OBJECT[i].resize) continue
                OBJECT[i].resize(OBJECT)
            }
        },
        renderThree(){
            for(const i in OBJECT){
                if(!OBJECT[i].animate) continue
                OBJECT[i].animate(OBJECT)
            }
        },


        // event
        onWindowResize(){
            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
            TWEEN.update()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})