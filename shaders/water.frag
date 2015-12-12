#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D simulation;

vec4 unpack (vec4 raw) {
    return vec4((raw.x - 0.5) * 2.0, (raw.y - 0.5) * 2.0, (raw.b - 0.5) * 2.0, raw.a);
}

void main(void) {
    vec4 data = unpack(texture2D(simulation, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5)));
    float waterHeight = data.b;
    gl_FragColor = vec4(0.0, 0.3, 0.8, sqrt(waterHeight) * 2.0);
}