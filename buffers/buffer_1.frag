#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution; 

uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 diff = vec3( vec2(1.0) / u_resolution.xy, 0.0);
    vec2 mouse_uv = u_mouse.xy / u_resolution.xy;
    float mouse_pointer = smoothstep(1.5, 0.5, length((mouse_uv - uv) * u_resolution) );

#ifdef BUFFER_0
    // Ping
    vec4 center = texture2D(u_buffer1, uv);
    float top = texture2D(u_buffer1, uv - diff.zy).r;
    float left = texture2D(u_buffer1, uv - diff.xz).r;
    float right = texture2D(u_buffer1, uv + diff.xz).r;
    float bottom = texture2D(u_buffer1, uv + diff.zy).r;

    float red = -(center.g - 0.5) * 2.0 + (top + left + right + bottom - 2.0);
    red += mouse_pointer; // mouse
    red *= 0.98; // damping
    red *= step(0.1, u_time); // hacky way of clearing the buffer
    red = 0.5 + red * 0.5;
    red = clamp(red, 0., 1.);
    gl_FragColor = vec4(red, center.r, 0.0, 0.0);

#elif defined( BUFFER_1 )
    // Pong 
    // Note: in this example you can get away with only one buffer...
    //       still is good to show off how easy is to make another buffer
    vec4 ping = texture2D(u_buffer0, uv, 0.0);
    if (u_time < 1.) {
        ping = vec4(vec3(0.5), 1.);
    }
    gl_FragColor = ping;

#else
    // Main Buffer
    vec4 ripples = texture2D(u_buffer1, uv);
    gl_FragColor = vec4(vec3(ripples.r), 1.);
#endif
}