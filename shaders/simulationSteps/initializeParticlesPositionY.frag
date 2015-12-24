#ifdef GL_ES
    precision highp float;
#endif

varying vec2 particleLookupCoordinate;
uniform sampler2D spawnPointMap;
uniform float nSpawnPointsRoot;

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
    vec4 spawnPoint = texture2D(spawnPointMap, particleLookupCoordinate);
    gl_FragColor = encode(spawnPoint.y + particleLookupCoordinate.y / 16.0 + 0.01 * rand(-particleLookupCoordinate.yx));
}