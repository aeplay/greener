#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D pressureAndVelocity;
uniform vec2 slopeTilt;
uniform sampler2D level;

float k = 1.0;

 float P (float d) {
     return k * pow(d / 0.1, 5.0);
 }

void main (void) {
    float dt = 1.0/120.0;
    float offset = 1.5/256.0;

    float pressureRight  = texture2D(pressureAndVelocity, uv + vec2(offset, 0.0)).x;
    float pressureLeft   = texture2D(pressureAndVelocity, uv - vec2(offset, 0.0)).x;
    float pressureTop    = texture2D(pressureAndVelocity, uv + vec2(0.0, offset)).x;
    float pressureBottom = texture2D(pressureAndVelocity, uv - vec2(0.0, offset)).x;

    float terrainRight  = texture2D(level, uv + vec2(offset, 0.0)).r;
    float terrainLeft   = texture2D(level, uv - vec2(offset, 0.0)).r;
    float terrainTop    = texture2D(level, uv + vec2(0.0, offset)).r;
    float terrainBottom = texture2D(level, uv - vec2(0.0, offset)).r;

    vec2 terrainAcceleration = vec2(terrainLeft - terrainRight, terrainBottom - terrainTop);

    vec4 here = texture2D(pressureAndVelocity, uv);
    vec2 velocity = here.yz;

    vec2 newVelocity = velocity - 0.5 * ( dt * vec2(
        P(pressureRight) - P(pressureLeft),
        P(pressureTop) - P(pressureBottom)
    ) + slopeTilt * dt - 100.0 * terrainAcceleration * dt );

    // TODO: readd
    //newVelocity *= dt * 1.0 / (1.2 * here.x * here.x);

    if (uv.x < offset) {
        newVelocity.x = max(0.5, newVelocity.x);
    }

    if (uv.x > 1.0 - offset) {
        newVelocity.x = min(0.5, newVelocity.x);
    }

    if (uv.y < offset) {
        newVelocity.y = max(0.5, newVelocity.y);
    }

    if (uv.y > 1.0 - offset) {
        newVelocity.y = min(0.5, newVelocity.y);
    }

    gl_FragColor = vec4(here.x, newVelocity, 1.0);
}