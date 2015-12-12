#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D terrainAndWater;
uniform sampler2D oldOutflows;

void main (void) {
    float dt = 1.0/60.0;
    float offset = 1.0/256.0;
    float A = 5.0;
    float l = 1.0;
    float g = 9.81;

    vec4 here   = texture2D(terrainAndWater, uv);

    vec4 top    = texture2D(terrainAndWater, uv + vec2(0.0, offset));
    vec4 right  = texture2D(terrainAndWater, uv + vec2(offset, 0.0));
    vec4 bottom = texture2D(terrainAndWater, uv - vec2(0.0, offset));
    vec4 left   = texture2D(terrainAndWater, uv - vec2(offset, 0.0));

    vec4 oldOutflowsHere = texture2D(oldOutflows, uv);

    vec4 newOutflows = vec4(
        max(0.0, oldOutflowsHere.r + dt * A * g * (here.r + here.b - (top.r + top.b))),
        max(0.0, oldOutflowsHere.g + dt * A * g * (here.r + here.b - (right.r + right.b))),
        max(0.0, oldOutflowsHere.b + dt * A * g * (here.r + here.b - (bottom.r + bottom.b))),
        max(0.0, oldOutflowsHere.a + dt * A * g * (here.r + here.b - (left.r + left.b)))
    );

    float outflowSum = newOutflows.r + newOutflows.g + newOutflows.b + newOutflows.a;

    float K = min(1.0, here.b * l * l / (outflowSum * dt));

    outflowSum *= K;

    if (outflowSum <= 0.03) outflowSum = 0.0;

    gl_FragColor = newOutflows;
}