#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D pressureAndVelocity;
uniform vec2 slopeTilt;
uniform sampler2D level;

float k = 5.0;

 float P (float d) {
     return k * pow(d / 0.08, 8.0);
 }

void main (void) {
    float dt = 1.0/240.0;
    float offset = 1.0/256.0;

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

    vec2 newVelocity = velocity - dt * vec2(
        P(pressureRight) - P(pressureLeft),
        P(pressureTop) - P(pressureBottom)
    ) + slopeTilt * dt + 1000.0 * terrainAcceleration * dt;

    if (uv.x < offset) {
        newVelocity.x = max(0.0, newVelocity.x);
    }

    if (uv.x > 1.0 - offset) {
        newVelocity.x = min(0.0, newVelocity.x);
    }

    if (uv.y < offset) {
        newVelocity.y = max(0.0, newVelocity.y);
    }

    if (uv.y > 1.0 - offset) {
        newVelocity.y = min(0.0, newVelocity.y);
    }

    gl_FragColor = vec4(terrainRight/*here.x*/, newVelocity, 1.0);
}