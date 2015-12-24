#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
varying mat4 cameraInverseV;
uniform sampler2D densityAndVelocity;
uniform sampler2D level;
uniform float waterResolution;

void main(void) {
    float offset = 1.0 / waterResolution;

    vec4 data = texture2D(densityAndVelocity, position.xy);

    float terrainE = texture2D(level, position.xy + vec2(offset, 0.0)).r;
    float terrainW = texture2D(level, position.xy - vec2(offset, 0.0)).r;
    float terrainN = texture2D(level, position.xy + vec2(0.0, offset)).r;
    float terrainS = texture2D(level, position.xy - vec2(0.0, offset)).r;

    float depthE = texture2D(densityAndVelocity, position.xy + vec2(offset, 0.0)).r;
    float depthW = texture2D(densityAndVelocity, position.xy - vec2(offset, 0.0)).r;
    float depthN = texture2D(densityAndVelocity, position.xy + vec2(0.0, offset)).r;
    float depthS = texture2D(densityAndVelocity, position.xy - vec2(0.0, offset)).r;

    float gx = (terrainE + depthE - terrainW - depthW);
    float gy = (terrainN + depthN - terrainS - terrainS);

    vec3 normal = normalize(vec3(0.0, 0.0, 1.0) - 1000.0 * vec3(gx, gy, 0.0));
    vec3 lightDir = normalize(-vec3(1.0, 1.0, 1.0));

    float reflectionIntensity = dot(normal, lightDir);

    vec3 cameraLookDir = (cameraInverseV * vec4(0.0, 0.0, 1.0, 0.0)).xyz;

    float b = 0.5 * reflectionIntensity * dot(normal, cameraLookDir) + 0.5 * (1.0 - dot(normal, cameraLookDir));

    float pressure = data.r;

    if (pressure < 0.01)
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
    else
        gl_FragColor = sqrt(pressure) * 4.0 * vec4(0.2, 0.5, 0.8, 0.5) + (1.0 - sqrt(pressure) * 4.0) * vec4(0.8, 0.8, 1.0, 0.4), vec4(pressure * 3.0);
}