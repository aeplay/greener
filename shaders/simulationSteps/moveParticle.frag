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
    vec2 pVelocity = 2.0 * (particle.zw - vec2(0.5, 0.5));

    float r = 0.4;
    vec2 oldGridVelocity = 2.0 * (texture2D(oldPressureAndVelocity, pPosition).yz - vec2(0.5, 0.5));
    vec2 newGridVelocity = 2.0 * (texture2D(pressureAndVelocity, pPosition).yz - vec2(0.5, 0.5));
    vec2 newVelocity = r * newGridVelocity + (1.0 - r) * (pVelocity - (oldGridVelocity - newGridVelocity));

    vec2 halfPosition = pPosition + 0.5 * dt * newGridVelocity;
    vec2 newPosition = halfPosition + dt * 2.0 * (texture2D(pressureAndVelocity, halfPosition).yz - vec2(0.5, 0.5));

    //vec2 newPosition = pPosition + dt * newGridVelocity;

    //newPosition = clamp(newPosition, 0.01, 0.99);

    gl_FragColor = vec4(newPosition, (newVelocity + 1.0) / 2.0);
}