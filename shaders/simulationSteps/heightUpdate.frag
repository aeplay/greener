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
    float offset = 1.0/256.0;

    vec4 dataX1 = unpack(texture2D(simulation, uv - vec2(offset, 0.0)));
    vec4 dataX2 = unpack(texture2D(simulation, uv + vec2(offset, 0.0)));
    vec4 dataY1 = unpack(texture2D(simulation, uv - vec2(0.0, offset)));
    vec4 dataY2 = unpack(texture2D(simulation, uv + vec2(0.0, offset)));

    float dVelocityX = (dataX2.x - dataX1.x) / (2.0 * offset);
    float dVelocityY = (dataY2.y - dataY1.y) / (2.0 * offset);
    float velocityDivergence = (dVelocityX + dVelocityY);

    vec4 dataHere = unpack(texture2D(simulation, uv));

    float newHeight;

    if (dataHere.b < 0.0) {
        if ((dataX1.b > 0.000001 && (dataX1.a + dataX1.b) > (dataHere.a + 0.000001))
        ||  (dataX2.b > 0.000001 && (dataX2.a + dataX2.b) > (dataHere.a + 0.000001))
        ||  (dataY1.b > 0.000001 && (dataY1.a + dataY1.b) > (dataHere.a + 0.000001))
        ||  (dataY2.b > 0.000001 && (dataY2.a + dataY2.b) > (dataHere.a + 0.000001))) newHeight = 0.000003;
        else newHeight = dataHere.b;
    } else {
        float fluxArea = max(dataHere.b, 0.2);
        newHeight = dataHere.b - fluxArea * velocityDivergence * dt;
    }

    gl_FragColor = pack(vec4(dataHere.xy, newHeight, dataHere.a));
}