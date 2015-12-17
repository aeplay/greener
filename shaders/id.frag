#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D texture;
varying vec2 uv;

void main (void) {
    vec4 color = texture2D(texture, uv);
    gl_FragColor = vec4(color.r * 50.0, (color.gb - 0.5) * 10.0 + 0.5, color.a);
}