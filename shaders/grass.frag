#ifdef GL_ES
    precision highp float;
#endif

varying float foliagity;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main (void) {
    float foliagityStronger = min(1.0, foliagity * 15.0);
    if (mod(gl_PointCoord.x, 0.2) < 0.1) {
        discard;
    }
    gl_FragColor = (0.7 + 0.4 * rand(vec2(gl_PointCoord.x, 0.0))) * foliagityStronger * vec4(0.2, 0.7, 0.0, 1.0) + (1.0 - foliagityStronger) * vec4(0.5, 0.45, 0.4, 1.0);
}