#ifdef GL_ES
precision highp float;
#endif

varying vec2 uv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main (void) {
    gl_FragColor = vec4((uv / 7.0), 0.5, 0.5);
}