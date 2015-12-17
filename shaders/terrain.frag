#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D pressureAndVelocity;
uniform sampler2D level;

void main(void) {
    vec2 uv = vec2(position.x / 256.0 + 0.5, -position.y / 256.0 + 0.5);
    vec4 color = texture2D(level, uv);
    float offset = 12.5/256.0;

    float pressureRight  = texture2D(pressureAndVelocity, uv + vec2(offset, 0.0)).x;
    float pressureLeft   = texture2D(pressureAndVelocity, uv - vec2(offset, 0.0)).x;
    float pressureTop    = texture2D(pressureAndVelocity, uv + vec2(0.0, offset)).x;
    float pressureBottom = texture2D(pressureAndVelocity, uv - vec2(0.0, offset)).x;

    //if (pressureRight > 0.1 || pressureTop > 0.1 || pressureBottom > 0.1 || pressureLeft > 0.1) {
    //    gl_FragColor = vec4(0.0, 0.5, 0.0, 1.0);
    //} else {
        gl_FragColor = vec4(color.r * 0.7, 0.7 * color.r, 0.5 * color.r, 1.0);
    //}
}