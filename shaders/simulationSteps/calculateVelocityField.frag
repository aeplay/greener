#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D densityAndVelocity;
uniform float fieldResolution;
uniform float pressureForceMultiplier;
uniform float pressureForceExponent;
uniform float initialDensity;
uniform float dt;
uniform vec2 slopeTilt;
uniform sampler2D level;

varying vec2 fieldCoordinate;

float pressure (float density) {
    return pressureForceMultiplier * pow(density / initialDensity, pressureForceExponent);
}

void main (void) {
    float offset = 2.0/fieldResolution;

    float densityN = texture2D(densityAndVelocity, fieldCoordinate + vec2(0.0, offset)).x;
    float densityE = texture2D(densityAndVelocity, fieldCoordinate + vec2(offset, 0.0)).x;
    float densityS = texture2D(densityAndVelocity, fieldCoordinate - vec2(0.0, offset)).x;
    float densityW = texture2D(densityAndVelocity, fieldCoordinate - vec2(offset, 0.0)).x;

     float terrainE = texture2D(level, fieldCoordinate + vec2(offset, 0.0)).r;
     float terrainW = texture2D(level, fieldCoordinate - vec2(offset, 0.0)).r;
     float terrainN = texture2D(level, fieldCoordinate + vec2(0.0, offset)).r;
     float terrainS = texture2D(level, fieldCoordinate - vec2(0.0, offset)).r;

     vec2 terrainAcceleration = vec2(terrainE - terrainW, terrainN - terrainS);

    vec4 densityAndVelocityHere = texture2D(densityAndVelocity, fieldCoordinate);
    float density = densityAndVelocityHere.x;
    vec2 velocity = densityAndVelocityHere.yz;

    vec2 newVelocity = velocity - 0.5 * dt * vec2(
        pressure(densityE) - pressure(densityW),
        pressure(densityN) - pressure(densityS)
    ) - 6.0 * dt * slopeTilt - 100.0 * dt * terrainAcceleration;

    gl_FragColor = vec4(density, newVelocity, 1.0);
}