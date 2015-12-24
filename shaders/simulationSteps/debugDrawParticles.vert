#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D particlePositionX;
uniform sampler2D particlePositionY;
uniform float nParticles;
uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;
uniform float terrainSize;

attribute vec3 particleLookupCoordinate;

float decode (vec4 floatAsRGBA) {
    return dot( floatAsRGBA, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );
}

void main (void) {
    vec2 position = vec2(
        decode(texture2D(particlePositionX, particleLookupCoordinate.xy)),
        decode(texture2D(particlePositionY, particleLookupCoordinate.xy))
    );

    gl_PointSize = 2.0;
    //    gl_Position = vec4((position - 0.5) * 2.0, 0.0, 1.0);
    gl_Position = cameraProjection * cameraInverse * transform * vec4(terrainSize * (position - vec2(0.5, 0.5)), 30.0, 1.0);
}