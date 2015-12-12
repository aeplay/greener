#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D simulation;

vec4 unpack (vec4 raw) {
    return vec4((raw.x - 0.5) * 2.0, (raw.y - 0.5) * 2.0, (raw.b - 0.5) * 2.0, raw.a);
}

vec4 pack (vec4 unpacked) {
    return vec4((unpacked.x / 2.0) + 0.5, (unpacked.y / 2.0) + 0.5, (unpacked.b / 2.0) + 0.5, unpacked.a);
}

void main(void) {
    float dt = 1.0/120.0;
    vec4 dataHere = unpack(texture2D(simulation, uv));

    if (dataHere.a <= 0.0) {
        gl_FragColor = pack(dataHere);
    } else {
        vec2 origin = uv + dt * dataHere.xy;
        vec4 dataAtOrigin = unpack(texture2D(simulation, uv));

        float newHeight = dataAtOrigin.b;
        vec2 newVelocity = dataAtOrigin.xy;

        if (newHeight <= 0.0) {
            newHeight = dataHere.b;
            newVelocity = vec2(0.0, 0.0);
        }

        gl_FragColor = pack(vec4(newVelocity, newHeight, dataHere.a));
    }
}