#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D simulation;

void main(void) {
    float dt = 1.0/60.0;
    float offset = 1.0/256.0;

    vec4 dataX1 = texture2D(simulation, uv - vec2(offset, 0.0));
    vec4 dataX2 = texture2D(simulation, uv + vec2(offset, 0.0));
    vec4 dataY1 = texture2D(simulation, uv - vec2(0.0, offset));
    vec4 dataY2 = texture2D(simulation, uv + vec2(0.0, offset));

    float dVelocityX = (dataX2.x - dataX1.x) / (2.0 * offset);
    float dVelocityY = (dataY2.y - dataY1.y) / (2.0 * offset);
    float velocityDivergence = (dVelocityX + dVelocityY);

    vec4 dataHere = texture2D(simulation, uv);

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

    gl_FragColor = vec4(dataHere.xy, newHeight, dataHere.a);
}