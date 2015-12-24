#ifdef GL_ES
    precision highp float;
#endif

attribute vec3 vertices;

uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;
uniform float terrainSize;
uniform sampler2D level;
uniform sampler2D foliage;

varying float foliagity;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main (void) {
    vec2 position = vertices.xy + vec2(0.005 * rand(vertices.xy), 0.005 * rand(-vertices.yx));
    vec4 levelData = texture2D(level, position);
    vec4 foliageData = texture2D(foliage, position);

    foliagity = foliageData.b - 0.03 * rand(position);

    if (foliageData.g > 0.05 || foliageData.r < 0.005 + 0.025 * rand(position))
        gl_Position = vec4(10000.0, 10000.0, 10000.0, 0.0);
    else {
        gl_PointSize = 3.0 + 100.0 * foliagity + 4.0 * rand(position);
        gl_Position = cameraProjection * cameraInverse * transform * vec4(terrainSize * (position - vec2(0.5, 0.5)), 60.0 * levelData.r + 1.0, 1.0);
    }
}