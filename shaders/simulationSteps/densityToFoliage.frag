#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D s_texture;
uniform float dt;
uniform sampler2D oldFoliage;

varying vec2 v_texCoord;
varying vec2 v_blurTexCoords[8];

void main()
{
    gl_FragColor = vec4(0.0);
    float newFoliagity = 0.0;
    vec4 oldInfo = texture2D(oldFoliage, v_texCoord);
    vec4 center = texture2D(s_texture, v_texCoord);
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[ 0])*0.0044299121055113265;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[ 1])*0.00895781211794;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[ 2])*0.0215963866053;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 0]).r*0.0443683338718;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 1]).r*0.0776744219933;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 2]).r*0.115876621105;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 3]).r*0.147308056121;
    newFoliagity += center.r* 0.159576912161;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 4]).r*0.147308056121;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 5]).r*0.115876621105;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 6]).r*0.0776744219933;
    newFoliagity += texture2D(s_texture, v_blurTexCoords[ 7]).r*0.0443683338718;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[11])*0.0215963866053;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[12])*0.00895781211794;
    //gl_FragColor += texture2D(s_texture, v_blurTexCoords[13])*0.0044299121055113265;

    gl_FragColor.r = (1.0 - 10.0 * dt) * oldInfo.r + 10.0 * dt * newFoliagity;
    gl_FragColor.g = center.g;
    if (center.g < 0.1) {
        gl_FragColor.b = max(oldInfo.b, newFoliagity);
    } else {
        gl_FragColor.b = oldInfo.b;
    }
    gl_FragColor.a = max(oldInfo.a, center.g);
}