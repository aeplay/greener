#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D texture;

void main(void) {
    vec4 color = texture2D(texture, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    gl_FragColor = color;
}