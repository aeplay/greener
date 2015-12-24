uniform	mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;
attribute vec3 info;
uniform float terrainSize;
uniform sampler2D level;
uniform sampler2D foliage;

varying float lifecycle;

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

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
    float recursionLevel = 4.0;
    float branch = info.x;

    vec3 treeOffset = vec3(info.yz, 0.0);

    vec4 foliageInfo = texture2D(foliage, treeOffset.xy);
    float foliagity = 10.0 * max(foliageInfo.r, foliageInfo.b);

    if (foliageInfo.a > 0.1) {
        // dead tree
        foliagity = 10.0 * 0.1;
    }

    float branchingFactor = 4.0;
    float branchLength = 0.5 + 1.0 * pow(foliagity, 0.5) + 2.0 * pow(foliagity, 0.3);
    float initialThickness = 0.2 + 0.5 * foliagity;
    float branchLengthMultiplier = 0.3 + 0.2 * foliagity;
    float sidewaysRotation = 50.0;
    float thinningMultiplier = 0.5;

    vec3 vertex = vertices;
    vertex *= initialThickness;
    vec3 position = vec3(0.0, 0.0, 0.0);
    vec3 direction = vec3(0.0, 0.0, 1.0);
    vec3 sidewaysDirection = vec3(0.0, 1.0, 0.0);

    if (foliageInfo.b < 0.08) {
        lifecycle = 0.0;
    } else {
        lifecycle = 0.5;
    }

    if (foliageInfo.a > 0.1) {
        // dead tree
        lifecycle = 1.0;
        float randomAngle = rand(treeOffset.xy) * 360.0;
        direction = rotate_vertex_position(direction, vec3(0.0, 0.0, 1.0), randomAngle);
        sidewaysDirection = rotate_vertex_position(sidewaysDirection, vec3(0.0, 0.0, 1.0), randomAngle);
        direction = rotate_vertex_position(direction, sidewaysDirection, 80.0);
    }

    for (float i = 0.0; i < 7.9; i += 1.0) {

        if (i < recursionLevel) {
            if (i > 0.0) {
                float parent = branch;

                for (float backwards = 0.0; backwards < 7.9; backwards += 1.0) {
                    if (backwards < recursionLevel - 1.0 - i) {
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
            if (i + 0.5 < recursionLevel) {
                position += branchLength * direction;
                vertex *= thinningMultiplier;
            }
        }
    }

    float terrainHeight = texture2D(level, treeOffset.xy).r;

    gl_PointSize = 5.0;
    gl_Position = cameraProjection * cameraInverse * transform * vec4(
        (vertex + position) * 0.02 * terrainSize + (treeOffset - vec3(0.5, 0.5, 0.0)) * terrainSize + vec3(0.0, 0.0, 60.0 * terrainHeight),
    1.0);
}