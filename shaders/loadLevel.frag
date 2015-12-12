#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D level;

vec4 pack (vec4 unpacked) {
    return vec4((unpacked.x / 2.0) + 0.5, (unpacked.y / 2.0) + 0.5, (unpacked.b / 2.0) + 0.5, unpacked.a);
}

void main(void) {
    vec4 color = texture2D(level, uv);
    gl_FragColor = pack(vec4(
        0, // velocity x
        0, // velocity y
        color.b - color.r, // water depth (not level!)
        color.r // terrain height
    ));
}