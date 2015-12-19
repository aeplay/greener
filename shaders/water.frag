#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D densityAndVelocity;
uniform sampler2D level;

void main(void) {
    vec4 data = texture2D(densityAndVelocity, position.xy);
    float pressure = data.r;
    gl_FragColor = vec4(0.0, 0.3, 0.8, pow(pressure, 0.3) * 1.0);
}