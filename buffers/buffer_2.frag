// https://www.shadertoy.com/view/3tf3R4

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform int u_frame;

uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

#ifdef BUFFER_0
    // Buffer A
    uv = (gl_FragCoord.xy - u_resolution.xy*.5)/u_resolution.y;
    float t = u_time*2.;
    uv += vec2(sin(t), cos(t))*.3;    
    float d = length(uv);
    float m = smoothstep(.11 + (sin(u_time*.5)*.5+.5)*.1, .10, d);            
    // vec3 col = hue(u_time).xyz * m;
    // vec4 col = vec4(1.0);
    vec3 col = clamp(abs(fract(u_time + vec4(3,2,1,0)/3.) * 6. -3.) -1. , 0., 1.).xyz * m;
    gl_FragColor = vec4(col, 1.);

    // // Buffer A
    // uv = (gl_FragCoord.xy - u_resolution.xy*.5)/u_resolution.y;
    // float t = u_time*2.;
    // uv += vec2(sin(t), cos(t))*.3;    
    // float d = length(uv);
    // float m = smoothstep(.11 + (sin(u_time*.5)*.5+.5)*.1, .10, d);            
    // vec3 col = hue(u_time).xyz * m;
    // gl_FragColor = vec4(col,0.1);

#elif defined( BUFFER_1 )
    // Buffer B
    vec4 col = texture2D(u_buffer1, uv, 0.0) * .98;
    if(mod(float(u_frame), 12.) == 0.){
    	col += texture2D(u_buffer0, uv, 0.0);	
    }
    gl_FragColor = col;

    // // Buffer B
    // vec3 col = texture2D(u_buffer1, uv).rgb * .98;
    // if(mod(float(u_frame), 12.) == 0.){
    // 	col += texture2D(u_buffer0, uv).rgb;	
    // }
    // gl_FragColor = vec4(col,1.0);

#else
    // // Image buffer
    vec4 backCol = texture2D(u_buffer0, uv, 0.0);
    uv = (gl_FragCoord.xy - u_resolution.xy*.5)/u_resolution.y;
    float t = u_time*2.;
    uv += vec2(sin(t), cos(t))*.3;    
    float d = 0.05/length(uv);
    float m = smoothstep(.06, .05, d);            
    vec4 col = backCol + vec4(1.)*d;
    gl_FragColor = vec4(vec3(col.r), 1.);
    
    // // Image buffer
    // vec3 backCol = texture2D(u_buffer0, uv).rgb;
    // uv = (gl_FragCoord.xy - u_resolution.xy*.5)/u_resolution.y;
    // float t = u_time*2.;
    // uv += vec2(sin(t), cos(t))*.3;    
    // float d = 0.05/length(uv);
    // float m = smoothstep(.06, .05, d);            
    // vec3 col = backCol + vec3(1.)*d;
    // gl_FragColor = vec4(col,1.0);
#endif
}