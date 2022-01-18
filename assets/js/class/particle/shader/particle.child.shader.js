export default {
    vertex: `
        attribute float aOpacity;

        varying float vOpacity;

        uniform float uSize;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            gl_PointSize = uSize;

            vOpacity = aOpacity;
        }
    `,
    fragment: `
        uniform vec3 uColor;
        uniform float uOpacity;

        varying float vOpacity;

        void main(){
            gl_FragColor = vec4(uColor, vOpacity * uOpacity);
        }
    `
}