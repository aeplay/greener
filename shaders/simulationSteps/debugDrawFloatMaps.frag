#ifdef GL_ES
    precision highp float;
#endif

varying vec2 particleLookupCoordinate;
uniform sampler2D red;
uniform sampler2D green;

float decode (vec4 floatAsRGBA) {
    return dot( floatAsRGBA, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );
}

void main (void) {
    gl_FragColor = vec4(
        decode(texture2D(red, particleLookupCoordinate)),
        decode(texture2D(green, particleLookupCoordinate)),
        0.0,
        1.0
    );
}