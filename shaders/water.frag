#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D pressureAndVelocity;
uniform sampler2D level;

void main(void) {
    vec4 data = texture2D(pressureAndVelocity, vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5));
    float pressure = data.r;
    gl_FragColor = vec4(0.0, 0.3, 0.8, sqrt(pressure) * 2.0);
}