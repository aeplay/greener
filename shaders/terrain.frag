#ifdef GL_ES
    precision highp float;
#endif

varying vec3 position;
uniform sampler2D densityAndVelocity;
uniform sampler2D level;

void main(void) {
    vec2 uv = position.xy;//vec2(position.x, position.y);
    vec4 color = texture2D(level, uv);
    float offset = 12.5/256.0;

    float pressureRight  = texture2D(densityAndVelocity, uv + vec2(offset, 0.0)).x;
    float pressureLeft   = texture2D(densityAndVelocity, uv - vec2(offset, 0.0)).x;
    float pressureTop    = texture2D(densityAndVelocity, uv + vec2(0.0, offset)).x;
    float pressureBottom = texture2D(densityAndVelocity, uv - vec2(0.0, offset)).x;

    //if (pressureRight > 0.1 || pressureTop > 0.1 || pressureBottom > 0.1 || pressureLeft > 0.1) {
    //    gl_FragColor = vec4(0.0, 0.5, 0.0, 1.0);
    //} else {
        gl_FragColor = vec4(color.r * 0.7, 0.7 * color.r, 0.5 * color.r, 1.0);
    //}
}