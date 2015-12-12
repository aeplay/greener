#ifdef GL_ES
    precision highp float;
#endif

varying vec2 uv;
uniform sampler2D simulation;

void main(void) {
    float dt = 1.0/60.0;
    vec4 dataHere = texture2D(simulation, uv);

    if (dataHere.a <= 0.0) {
        gl_FragColor = dataHere;
    } else {
        vec2 origin = uv + dt * dataHere.xy;
        vec4 dataAtOrigin = texture2D(simulation, uv);

        float newHeight = dataAtOrigin.b;
        vec2 newVelocity = dataAtOrigin.xy;

        if (newHeight <= 0.0) {
            newHeight = dataHere.b;
            newVelocity = vec2(0.0, 0.0);
        }

        gl_FragColor = vec4(newVelocity, newHeight, dataHere.a);
    }
}