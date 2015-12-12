#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D pressureAndVelocity;
uniform vec2 slopeTilt;

void main (void) {
    float dt = 1.0/60.0;
    float offset = 1.0/256.0;
    float pressureRight  = texture2D(pressureAndVelocity, uv + vec2(offset, 0.0)).x;
    float pressureLeft   = texture2D(pressureAndVelocity, uv - vec2(offset, 0.0)).x;
    float pressureTop    = texture2D(pressureAndVelocity, uv + vec2(0.0, offset)).x;
    float pressureBottom = texture2D(pressureAndVelocity, uv - vec2(0.0, offset)).x;

    vec4 here = texture2D(pressureAndVelocity, uv);
    vec2 velocity = here.yz;


    vec2 newVelocity = velocity - dt * vec2(
        pressureRight - pressureLeft,
        pressureTop - pressureBottom
    ) + slopeTilt * dt;

    gl_FragColor = vec4(here.x, newVelocity, 1.0);
}