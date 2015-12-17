#ifdef GL_ES
    precision highp float;
#endif

varying vec2 particleVelocity;

void main (void) {
    float weight = 0.05 * pow(max(0.0, (1.0 - distance(vec2(0.5, 0.5), gl_PointCoord))), 5.0);
    gl_FragColor = vec4(1.0, particleVelocity, weight);
}