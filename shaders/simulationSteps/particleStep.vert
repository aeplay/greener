#ifdef GL_ES
    precision highp float;
#endif

attribute vec3 vertices;
varying vec2 particleLookupCoordinate;

void main(void) {
    particleLookupCoordinate = vertices.xy / 2.0 + vec2(0.5, 0.5);
	gl_Position = vec4(vertices.x, vertices.y, 1.0, 1.0);
}