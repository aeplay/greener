#ifdef GL_ES
    precision highp float;
#endif

varying float foliagity;

void main (void) {
    float foliagityStronger = min(1.0, foliagity * 15.0);
    gl_FragColor = foliagityStronger * vec4(0.2, 0.7, 0.0, 1.0) + (1.0 - foliagityStronger) * vec4(0.5, 0.45, 0.4, 1.0);
}