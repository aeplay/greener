uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

varying vec3 position;
uniform sampler2D texture;

void main(void) {
    position = vertices;
    vec4 color = texture2D(texture, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices + vec3(0.0, 0.0, 20.0 * color.r), 1.0);
}