#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;

void main(void) {
    gl_FragColor = vec4(position / 128.0, 1.0);
}