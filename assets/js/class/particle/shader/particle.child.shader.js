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
        uniform float uTime;
        uniform float uRand;
        uniform sampler2D lifeVelocity;

        const float PI = ${Math.PI};

        ${ShaderMethod.snoise4D()}
        ${ShaderMethod.rand()}
        ${ShaderMethod.executeNormalizing()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec4 pos = texture(tPosition, uv);
            vec4 lifeVel = texture(lifeVelocity, uv);

            float n1 = snoise4D(vec4(pos.xyz * 0.4, uTime * 0.001));
            float n2 = snoise4D(vec4(pos.xyz * 0.5, uTime * 0.001));

            float pn1 = executeNormalizing(n1, 0.0, 1.0, -1.0, 1.0);
            float pn2 = executeNormalizing(n2, 0.0, 1.0, -1.0, 1.0);

            float scale = 0.25;
            // float theta = 2.0 * PI * pn1;
            float theta = 1.0 * PI * pn1;
            float phi = acos(2.0 * pn2 - 1.0);
            float velX = cos(theta) * sin(phi) * scale;
            float velY = sin(theta) * sin(phi) * scale;
            float velZ = cos(phi) * scale;

            // position
            pos.xyz += vec3(velX, velY, velZ);

            // life
            pos.w -= lifeVel.x;

            if(pos.w < 0.0){
                float x = rand(uv * uRand * 0.1) * 0.2 - 0.1;
                float y = rand(uv * uRand * 0.2) * 0.2 - 0.1;
                float z = rand(uv * uRand * 0.3) * 0.2 - 0.1;
                pos.xyz = vec3(x, y, z);
                pos.w = 1.0;
            }

            gl_FragColor = pos;
        }
    `
}