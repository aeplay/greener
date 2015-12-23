#ifdef GL_ES
    precision highp float;
#endif

attribute vec3 a_position;

uniform float blurFactor;
varying vec2 v_texCoord;
varying vec2 v_blurTexCoords[8];

void main()
{
    vec2 a_texCoord = a_position.xy / 2.0 + vec2(0.5, 0.5);
    gl_Position = vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
    //v_blurTexCoords[ 0] = v_texCoord + vec2(0.0, -0.028) * blurFactor;
    //v_blurTexCoords[ 1] = v_texCoord + vec2(0.0, -0.024) * blurFactor;
    //v_blurTexCoords[ 2] = v_texCoord + vec2(0.0, -0.020) * blurFactor;
    v_blurTexCoords[ 0] = v_texCoord + vec2(0.0, -0.016) * blurFactor;
    v_blurTexCoords[ 1] = v_texCoord + vec2(0.0, -0.012) * blurFactor;
    v_blurTexCoords[ 2] = v_texCoord + vec2(0.0, -0.008) * blurFactor;
    v_blurTexCoords[ 3] = v_texCoord + vec2(0.0, -0.004) * blurFactor;
    v_blurTexCoords[ 4] = v_texCoord + vec2(0.0,  0.004) * blurFactor;
    v_blurTexCoords[ 5] = v_texCoord + vec2(0.0,  0.008) * blurFactor;
    v_blurTexCoords[ 6] = v_texCoord + vec2(0.0,  0.012) * blurFactor;
    v_blurTexCoords[ 7] = v_texCoord + vec2(0.0,  0.016) * blurFactor;
    //v_blurTexCoords[11] = v_texCoord + vec2(0.0,  0.020) * blurFactor;
    //v_blurTexCoords[12] = v_texCoord + vec2(0.0,  0.024) * blurFactor;
    //v_blurTexCoords[13] = v_texCoord + vec2(0.0,  0.028) * blurFactor;
}
