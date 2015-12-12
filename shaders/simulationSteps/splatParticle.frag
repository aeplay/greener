#ifdef GL_ES
    precision highp float;
#endif

varying vec2 particleVelocity;

void main (void) {
    float weight = 0.01 * min(0.8, pow(max(0.0, 1.0 - distance(vec2(0.5,0.5), gl_PointCoord)), 10.0));
    gl_FragColor = vec4(weight, weight * particleVelocity, 1.0);
}