attribute vec3 vertices;
varying vec2 uv;

void main(void) {
    uv = vertices.xy / 2.0 + vec2(0.5, 0.5);
	gl_Position = vec4(vertices.x, vertices.y, 1.0, 1.0);
}