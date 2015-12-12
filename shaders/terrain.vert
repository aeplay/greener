uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

varying vec3 position;
uniform sampler2D terrainAndWater;

void main(void) {
    position = vertices;
    float height = texture2D(terrainAndWater, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5)).r;
    gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices + vec3(0.0, 0.0, 10.0 * height), 1.0);
}