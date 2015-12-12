#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D terrainAndWater;
uniform sampler2D outflows;

void main(void) {
    vec4 color = texture2D(terrainAndWater, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    vec4 outflowsHere = texture2D(outflows, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    gl_FragColor = vec4(outflowsHere.rgb, 1.0) + 0.5 * vec4(color.r, color.r, color.r, 1.0);
}