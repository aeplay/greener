#ifdef GL_ES
    precision highp float;
#endif

void main (void) {
    float weight = pow(max(0.0, 1.0 - 1.2 * distance(vec2(0.5,0.5), gl_PointCoord)), 3.0);
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.2 * weight);
}