#ifdef GL_ES
    precision highp float;
#endif

varying float lifecycle;

void main (void) {
    if (lifecycle < 0.25) {
        gl_FragColor = vec4(0.4, 0.8, 0.0, 1.0);
    } else if (lifecycle < 0.75) {
        gl_FragColor = vec4(0.1, 0.4, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.3, 0.1, 0.0, 1.0);
    }
}