#ifdef GL_ES
    precision highp float;
#endif

varying vec2 particleLookupCoordinate;

vec4 encode (float f) {
    vec4 enc = vec4(1.0, 255.0, 65025.0, 160581375.0) * f;
    enc = fract(enc);
    enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);
    return enc;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main (void) {
    gl_FragColor = encode(particleLookupCoordinate.x / 2.0 + 0.25 + 0.01 * rand(particleLookupCoordinate));
}