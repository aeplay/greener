#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D terrainAndWater;
uniform sampler2D oldOutflows;
uniform vec2 slopeTilt;

void main (void) {
    float dt = 1.0/60.0;
    float offset = 1.0/256.0;
    float A = 1.0;
    float l = 1.0;
    float g = 9.81;

    vec4 here   = texture2D(terrainAndWater, uv);

    vec4 top    = texture2D(terrainAndWater, uv + vec2(0.0, offset));
    vec4 right  = texture2D(terrainAndWater, uv + vec2(offset, 0.0));
    vec4 bottom = texture2D(terrainAndWater, uv - vec2(0.0, offset));
    vec4 left   = texture2D(terrainAndWater, uv - vec2(offset, 0.0));

    vec4 oldOutflowsHere = texture2D(oldOutflows, uv);

    vec4 newOutflows = vec4(
        here.b < top.r - here.r ? 0.0 : max(0.0, oldOutflowsHere.r + dt * A * g * (slopeTilt.y + here.r + here.b - (top.r + top.b))),
        here.b < right.r - here.r ? 0.0 : max(0.0, oldOutflowsHere.g + dt * A * g * (slopeTilt.x + here.r + here.b - (right.r + right.b))),
        here.b < bottom.r - here.r ? 0.0 : max(0.0, oldOutflowsHere.b + dt * A * g * (-slopeTilt.y + here.r + here.b - (bottom.r + bottom.b))),
        here.b < left.r - here.r ? 0.0 : max(0.0, oldOutflowsHere.a + dt * A * g * (-slopeTilt.x + here.r + here.b - (left.r + left.b)))
    );

    float outflowSum = newOutflows.r + newOutflows.g + newOutflows.b + newOutflows.a;

    float K = min(1.0, here.b * l * l / (outflowSum * dt));

    outflowSum *= K;

    //if (outflowSum <= 0.03) outflowSum = 0.0;

    gl_FragColor = newOutflows;
}