uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

varying vec3 position;
uniform sampler2D level;
uniform sampler2D pressureAndVelocity;
uniform float terrainSize;

void main(void) {
    position = vertices;
    float height = texture2D(level, position.xy).r;
    gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices * terrainSize + vec3(0.0, 0.0, 10.0 * height), 1.0);
}