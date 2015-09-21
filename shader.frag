#define W 10.0
#define LOOP 10.0

precision mediump float;

const vec2 scale = vec2(1.0 / 60.0, 1.0 / 60.0);
const vec2 wrap = vec2(10.0, 10.0);

uniform vec2 uRes;
uniform float uTick;

vec2 gradient(vec2 c) {
    return normalize(c);
}

float dotGradient(vec2 g, vec2 pos) {
    vec2 dist = pos - g;
    vec2 c = mod(g, wrap);
    vec2 grad = gradient(c);
    return dot(grad, dist);
}

float intrp(float a, float b, float w) {
    float f = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
    return a * (1.0 - f) + b * f;
}

void main() {
    // grid coordinates
    vec2 p = gl_FragCoord.xy * scale,
        g = floor(p), w = p - g;
    float tl = dotGradient(g, p);
    g += vec2(0.0, 1.0);
    float bl = dotGradient(g, p),
          left = intrp(tl, bl, w.y);
    g += vec2(1.0, -1.0);
    float tr = dotGradient(g, p);
    g += vec2(0.0, 1.0);
    float br = dotGradient(g, p),
          right = intrp(tr, br, w.y);
    float i = intrp(left, right, w.x);
    gl_FragColor = vec4(i, i, i, 1.0);
}
