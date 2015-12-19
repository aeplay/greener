#ifdef GL_ES
    precision highp float;
#endif

varying vec2 velocity;

void main (void) {
    float distance = 2.0 * distance(vec2(0.5, 0.5), gl_PointCoord);
    float weight = 0.3 * (1.0 - pow(distance, 0.1));
    gl_FragColor = vec4( 1.0, 0.5, 0.5, weight);
}