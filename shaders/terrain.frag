#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D level;

void main(void) {
    vec4 color = texture2D(level, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    gl_FragColor = vec4(color.r, color.r, color.r, 1.0);
}