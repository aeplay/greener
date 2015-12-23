#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D foliage;
uniform sampler2D level;

void main(void) {
    vec2 uv = position.xy;//vec2(position.x, position.y);
    vec4 color = texture2D(level, uv);
    vec4 foliageData = texture2D(foliage, uv);

    gl_FragColor = vec4(0.3 + color.r * 0.7, 0.3 + 0.7 * color.r + 0.2 * clamp(0.0, foliageData.r * 10.0, 0.6), 0.3 + 0.5 * color.r, 1.0);
}