uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

varying vec3 position;
uniform sampler2D simulation;

vec4 unpack (vec4 raw) {
    return vec4((raw.x - 0.5) * 2.0, (raw.y - 0.5) * 2.0, (raw.b - 0.5) * 2.0, raw.a);
}

void main(void) {
    position = vertices;
    vec4 color = unpack(texture2D(simulation, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5)));
    gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices + vec3(0.0, 0.0, 20.0 * (color.b + color.a)), 1.0);
}