uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

uniform sampler2D particles;

attribute vec3 vertices;
varying vec2 particleVelocity;

void main (void) {
    vec4 particle = texture2D(particles, vertices.xy/256.0);
    particleVelocity = particle.zw;
    gl_PointSize = 2.0;
    gl_Position = cameraProjection * cameraInverse * transform * vec4(particle.x * 256.0 - 128.0, -particle.y * 256.0 + 128.0, 5.0, 1.0);
}