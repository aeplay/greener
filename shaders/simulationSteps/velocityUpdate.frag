#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D simulation;

void main(void) {
    float dt = 1.0/60.0;
    float offset = 1.0/256.0;
    float gravity = 0.0981;
    float maxVelocity = 1000.0;

    vec4 dataHere = texture2D(simulation, uv);

    if (dataHere.b < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, dataHere.b, dataHere.a);
    } else {
        vec4 dataX1 = texture2D(simulation, uv - vec2(offset, 0.0));
        vec4 dataX2 = texture2D(simulation, uv + vec2(offset, 0.0));
        vec4 dataY1 = texture2D(simulation, uv - vec2(0.0, offset));
        vec4 dataY2 = texture2D(simulation, uv + vec2(0.0, offset));

        // boundary: assume water is flat until shoreline
        float L_here = dataHere.a + dataHere.b;
        float L_X1 = dataX1.b < 0.0 && dataX1.a > L_here ? L_here : (dataX1.a + dataX1.b);
        float L_X2 = dataX2.b < 0.0 && dataX2.a > L_here ? L_here : (dataX2.a + dataX2.b);
        float L_Y1 = dataY1.b < 0.0 && dataY1.a > L_here ? L_here : (dataY1.a + dataY1.b);
        float L_Y2 = dataY2.b < 0.0 && dataY2.a > L_here ? L_here : (dataY2.a + dataY2.b);

        vec2 slope = vec2(L_X2 - L_X1, L_Y2 - L_Y1) / (2.0 * offset);

        float n = 0.5;
        vec2 frictionSlope = dataHere.xy * length(dataHere.xy) * pow(n, 2.0) / pow(dataHere.b, 4.0/3.0);

        vec2 totalSlope = slope + frictionSlope;
        totalSlope.x = slope.x < 0.0 ? min(totalSlope.x, 0.0) : max(totalSlope.x, 0.0);
        totalSlope.x = slope.x == 0.0 ? 0.0 : totalSlope.x;
        totalSlope.y = slope.y < 0.0 ? min(totalSlope.y, 0.0) : max(totalSlope.y, 0.0);
        totalSlope.y = slope.y == 0.0 ? 0.0 : totalSlope.y;

        vec2 newVelocity = dataHere.xy - gravity * totalSlope * dt;

        if (length(newVelocity) > maxVelocity)
            newVelocity *= maxVelocity/length(newVelocity);

        if (dataX1.b < 0.0 || dataX2.b < 0.0) newVelocity.x = 0.0;
        if (dataY1.b < 0.0 || dataY2.b < 0.0) newVelocity.y = 0.0;

        gl_FragColor = vec4(newVelocity, dataHere.b, dataHere.a);
    }
}