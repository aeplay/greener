uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;
attribute vec4 info;
uniform float terrainSize;
uniform sampler2D foliage;

vec4 quat_from_axis_angle(vec3 axis, float angle) {
  vec4 qr;
  float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) {
  vec4 q = quat_from_axis_angle(axis, angle);
  vec3 v = position.xyz;
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main(void) {
    float level = info.x;
    float branch = info.y;

    vec3 treeOffset = vec3(info.zw, 0.0);

    float foliagity = 10.0 * texture2D(foliage, treeOffset.xy).r;

    float branchingFactor = 4.0;
    float branchLength = 5.0 * foliagity;
    float branchLengthMultiplier = 0.6 * 0.4 * foliagity;
    float sidewaysRotation = 50.0;
    float thinningMultiplier = 0.5;

    vec3 vertex = vertices;
    vec3 position = vec3(0.0, 0.0, 0.0);
    vec3 direction = vec3(0.0, 0.0, 1.0);
    vec3 sidewaysDirection = vec3(0.0, 1.0, 0.0);

    for (float i = 0.0; i < 7.9; i += 1.0) {

        if (i < level) {
            if (i > 0.0) {
                float parent = branch;

                for (float backwards = 0.0; backwards < 7.9; backwards += 1.0) {
                    if (backwards < level - 1.0 - i) {
                        parent = floor((parent - 1.0) / branchingFactor);
                    }
                }

                float branchInLevel = mod(parent - 1.0 + branchingFactor, branchingFactor);

                branchLength *= branchLengthMultiplier;
                vec3 oldDirection = direction.xyz;
                sidewaysDirection = rotate_vertex_position(sidewaysDirection, direction, 81.0 * branchInLevel);
                direction = rotate_vertex_position(direction, sidewaysDirection, sidewaysRotation);
                vertex = rotate_vertex_position(vertex, sidewaysDirection, sidewaysRotation);
            }
            // base

            // top
            if (i + 0.5 < level) {
                position += branchLength * direction;
                vertex *= thinningMultiplier;
            }
        }
    }

    gl_Position = cameraProjection * cameraInverse * transform * vec4((vertex + position) * 0.02 * terrainSize + (treeOffset - vec3(0.5, 0.5, 0.0)) * terrainSize, 1.0);
}