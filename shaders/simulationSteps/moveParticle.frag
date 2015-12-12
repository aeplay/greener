#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D oldPressureAndVelocity;
uniform sampler2D pressureAndVelocity;
uniform sampler2D particles;

void main (void) {
    float dt = 1.0/60.0;
    vec4 particle = texture2D(particles, uv);
    vec2 pPosition = particle.xy;
    vec2 pVelocity = particle.zw;

    float r = 0.05;
    vec2 oldGridVelocity = texture2D(oldPressureAndVelocity, pPosition).yz;
    vec2 newGridVelocity = texture2D(pressureAndVelocity, pPosition).yz;
    vec2 newVelocity = r * newGridVelocity + (1.0 - r) * (pVelocity - (oldGridVelocity - newGridVelocity));

    vec2 halfPosition = pPosition + 0.5 * dt * newGridVelocity;
    vec2 newPosition = halfPosition + dt * texture2D(pressureAndVelocity, halfPosition).yz;

    //vec2 newPosition = pPosition + dt * newGridVelocity;

    gl_FragColor = vec4(newPosition, newVelocity);
}