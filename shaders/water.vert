uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

varying vec3 position;
uniform sampler2D pressureAndVelocity;
uniform sampler2D level;

void main(void) {
    position = vertices;
    vec4 pressure = texture2D(pressureAndVelocity, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    vec4 data = texture2D(level, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices + vec3(0.0, 0.0, 10.0 * (data.r + pressure.r)), 1.0);
}