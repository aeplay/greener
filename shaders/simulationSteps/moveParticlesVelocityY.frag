#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D oldDensityAndVelocity;
uniform sampler2D densityAndVelocity;
uniform sampler2D particlePositionX;
uniform sampler2D particlePositionY;
uniform sampler2D particleVelocityX;
uniform sampler2D particleVelocityY;

uniform float dt;
uniform float particleViscosity;

varying vec2 particleLookupCoordinate;

float decode (vec4 floatAsRGBA) {
    return dot( floatAsRGBA, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );
}

vec4 encode (float f) {
    vec4 enc = vec4(1.0, 255.0, 65025.0, 160581375.0) * f;
    enc = fract(enc);
    enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);
    return enc;
}

void main (void) {
    vec2 position = vec2(
        decode(texture2D(particlePositionX, particleLookupCoordinate)),
        decode(texture2D(particlePositionY, particleLookupCoordinate))
    );

    vec2 velocity = vec2(
        decode(texture2D(particleVelocityX, particleLookupCoordinate)),
        decode(texture2D(particleVelocityY, particleLookupCoordinate))
    );

    vec2 oldFieldVelocity = 2.0 * (texture2D(oldDensityAndVelocity, position).yz - vec2(0.5, 0.5));
    vec2 newFieldVelocity = 2.0 * (texture2D(densityAndVelocity, position).yz - vec2(0.5, 0.5));

    vec2 newVelocity = particleViscosity * newFieldVelocity + (1.0 -particleViscosity) * (velocity - (oldFieldVelocity - newFieldVelocity));

    // Runge-Kutta 2
    vec2 halfPosition = position + 0.5 * dt * oldFieldVelocity;
    vec2 velocityAtHalfPosition = 2.0 * (texture2D(densityAndVelocity, halfPosition).yz - vec2(0.5, 0.5));
    vec2 newPosition = halfPosition + dt * velocityAtHalfPosition;

    newPosition = clamp(newPosition, 0.01, 0.99);

    gl_FragColor = encode(newVelocity.y);
}