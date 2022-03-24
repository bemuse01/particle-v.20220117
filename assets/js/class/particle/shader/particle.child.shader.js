import ShaderMethod from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            varying float vOpacity;

            uniform float uSize;
            uniform sampler2D tPosition;

            void main(){
                vec3 newPosition = position;

                vec4 pos = texture(tPosition, uv);

                newPosition.xyz = pos.xyz;
                vOpacity = pos.w;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                gl_PointSize = uSize;
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
    },
    position: `
        uniform float uLifeVelocity;
        uniform float uTime;
        uniform sampler2D staticPosition;

        const float PI = ${Math.PI};

        ${ShaderMethod.snoise4D()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec4 pos = texture(tPosition, uv);
            vec4 staticPos = texture(staticPosition, uv);

            float n1 = snoise4D(vec4(pos.xyz, uTime * 0.001));
            float n2 = snoise4D(vec4(pos.xyz, uTime * 0.001));

            float theta = 2.0 * PI * n1;
            float phi = acos(2.0 * n2 - 1.0);
            float velX = cos(theta) * sin(phi) * 0.5;
            float velY = sin(theta) * sin(phi) * 0.5;
            float velZ = cos(phi) * 0.5;

            // position
            pos.xyz += vec3(velX, velY, velZ);

            // life
            pos.w -= uLifeVelocity;

            if(pos.w < 0.0){
                pos.xyz = staticPos.xyz;
                pos.w = 1.0;
            }

            gl_FragColor = pos;
        }
    `
}