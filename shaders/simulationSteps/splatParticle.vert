uniform sampler2D particles;

attribute vec3 vertices;
varying vec2 particleVelocity;

void main (void) {
    vec4 particle = texture2D(particles, vertices.xy/16.0);
    particleVelocity = particle.zw;
    gl_PointSize = 13.0;
    gl_Position = vec4(particle.xy, 0.0, 1.0);
}