#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D s_texture;

varying vec2 v_texCoord;
varying vec2 v_blurTexCoords[8];

void main()
{
    gl_FragColor = vec4(0.0);
    vec4 center = texture2D(s_texture, v_texCoord);
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[ 0])*0.0044299121055113265;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[ 1])*0.00895781211794;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[ 2])*0.0215963866053;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 0]).r*0.0443683338718;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 1]).r*0.0776744219933;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 2]).r*0.115876621105;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 3]).r*0.147308056121;
    gl_FragColor.r += center.r* 0.159576912161;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 4]).r*0.147308056121;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 5]).r*0.115876621105;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 6]).r*0.0776744219933;
    gl_FragColor.r += texture2D(s_texture, v_blurTexCoords[ 7]).r*0.0443683338718;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[11])*0.0215963866053;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[12])*0.00895781211794;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[13])*0.0044299121055113265;

    gl_FragColor.g = center.g;
}