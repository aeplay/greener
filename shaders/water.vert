uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

varying vec3 position;
varying mat4 cameraInverseV;
uniform sampler2D densityAndVelocity;
uniform sampler2D level;
uniform float terrainSize;

void main(void) {
    position = vertices;
    cameraInverseV = cameraInverse;
    vec4 densityData = texture2D(densityAndVelocity, position.xy);
    vec4 levelData = texture2D(level, position.xy);
    gl_Position = cameraProjection * cameraInverse * transform * vec4((vertices - vec3(0.5, 0.5, 0.0)) * terrainSize + vec3(0.0, 0.0, 60.0 * levelData.r + 10.0 * densityData.r), 1.0);
}