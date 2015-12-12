#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D simulation;

void main(void) {
    vec4 data = texture2D(simulation, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    float waterHeight = data.b;
    gl_FragColor = vec4(0.0, 0.3, 0.8, waterHeight * 2.0);
}