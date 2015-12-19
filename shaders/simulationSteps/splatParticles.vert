#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D particlePositionX;
uniform sampler2D particlePositionY;
uniform sampler2D particleVelocityX;
uniform sampler2D particleVelocityY;
uniform float particleInfluenceRadius;

attribute vec3 particleLookupCoordinate;
varying vec2 position;
varying vec2 velocity;
varying float influenceRadius;

float decode (vec4 floatAsRGBA) {
    return dot( floatAsRGBA, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );
}

void main (void) {
    position = vec2(
        decode(texture2D(particlePositionX, particleLookupCoordinate.xy)),
        decode(texture2D(particlePositionY, particleLookupCoordinate.xy))
    );

    velocity = vec2(
        decode(texture2D(particlePositionX, particleLookupCoordinate.xy)),
        decode(texture2D(particlePositionY, particleLookupCoordinate.xy))
    );

    influenceRadius = particleInfluenceRadius;
    gl_PointSize = 2.0 * particleInfluenceRadius;
    gl_Position = vec4((position - 0.5) * 2.0, 0.0, 1.0);
}