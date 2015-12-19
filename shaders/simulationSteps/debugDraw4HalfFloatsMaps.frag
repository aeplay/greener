#ifdef GL_ES
    precision highp float;
#endif

varying vec2 particleLookupCoordinate;
uniform sampler2D map;

void main (void) {
    gl_FragColor = vec4(
        texture2D(map, particleLookupCoordinate).rgb,
        1.0
    );
}