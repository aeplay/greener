#ifdef GL_ES
precision highp float;
#endif

varying vec2 uv;
uniform sampler2D simulation;

void main(void) {
	vec4 data = texture2D(simulation, uv);
	gl_FragColor = vec4(
		data.xy,
		data.b + 0.01, // water depth (not level!)
		data.w // terrain height
	);
}