uniform sampler2D particles;

attribute vec3 vertices;
varying vec2 particleVelocity;

void main (void) {
    vec4 particle = texture2D(particles, vertices.xy/256.0);
    particleVelocity = particle.zw;
    gl_PointSize = 10.0;
    gl_Position = vec4(2.0 * (particle.xy - vec2(0.5, 0.5)), 0.0, 1.0);
}