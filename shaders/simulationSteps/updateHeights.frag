#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D terrainAndWater;
uniform sampler2D outflows;

void main (void) {
    float dt = 1.0/60.0;
    float offset = 1.0/256.0;
    float l = 1.0;

    vec4 here = texture2D(terrainAndWater, uv);

    vec4 outflowsTop    = texture2D(outflows, uv + vec2(0.0, offset));
    vec4 outflowsRight  = texture2D(outflows, uv + vec2(offset, 0.0));
    vec4 outflowsBottom = texture2D(outflows, uv - vec2(0.0, offset));
    vec4 outflowsLeft   = texture2D(outflows, uv - vec2(offset, 0.0));

    vec4 outflowsHere = texture2D(outflows, uv);

    float outflowSum = outflowsHere.r + outflowsHere.g + outflowsHere.b + outflowsHere.a;
    float inflowSum = outflowsTop.b + outflowsRight.a + outflowsBottom.r + outflowsLeft.g;

    gl_FragColor = vec4(
        here.r,
        0.0,
        here.b + dt * (inflowSum - outflowSum) / (l * l),
        0.0
    );
}