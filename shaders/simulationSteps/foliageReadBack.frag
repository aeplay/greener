#ifdef GL_ES
    precision highp float;
#endif

varying vec2 fieldCoordinate;
uniform sampler2D foliage;

void main (void) {
    gl_FragColor = texture2D(foliage, fieldCoordinate);
}