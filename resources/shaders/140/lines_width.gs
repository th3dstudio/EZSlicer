#version 150

// see as reference: https://github.com/mhalber/Lines/blob/master/geometry_shader_lines.h

layout(lines) in;
layout(triangle_strip, max_vertices = 4) out;

const vec2 aa_radius = vec2(1.5);

uniform vec2 viewport_size;
uniform float width;

out float line_width;
out float line_length;
out vec2 uv;

void main()
{
	float u_width        = viewport_size[0];
	float u_height       = viewport_size[1];
	float u_aspect_ratio = u_height / u_width;

	vec2 ndc_a = gl_in[0].gl_Position.xy / gl_in[0].gl_Position.w;
	vec2 ndc_b = gl_in[1].gl_Position.xy / gl_in[1].gl_Position.w;

	vec2 line_vector = ndc_b - ndc_a;
	vec2 viewport_line_vector = line_vector * viewport_size;
	vec2 dir = normalize(viewport_line_vector);
	vec2 normal_dir = vec2(-dir.y, dir.x);

	line_width  = max(1.0, width) + aa_radius[0];
	line_length = length(viewport_line_vector) + 2.0 * aa_radius[1];

	vec2 normal    = vec2(line_width / u_width, line_width / u_height) * normal_dir;
    vec2 extension = vec2(aa_radius[1] / u_width, aa_radius[1] / u_height) * dir;

	float half_line_width  = line_width * 0.5;
	float half_line_length = line_length * 0.5;

	uv = vec2(-half_line_width, half_line_length);
	gl_Position = vec4((ndc_a + normal - extension) * gl_in[0].gl_Position.w, gl_in[0].gl_Position.zw);
	EmitVertex();

	uv = vec2(-half_line_width, -half_line_length);
	gl_Position = vec4((ndc_a - normal - extension) * gl_in[0].gl_Position.w, gl_in[0].gl_Position.zw);
	EmitVertex();

	uv = vec2(half_line_width, half_line_length);
	gl_Position = vec4((ndc_b + normal + extension) * gl_in[1].gl_Position.w, gl_in[1].gl_Position.zw);
	EmitVertex();

	uv = vec2(half_line_width, -half_line_length);
	gl_Position = vec4((ndc_b - normal + extension) * gl_in[1].gl_Position.w, gl_in[1].gl_Position.zw);
	EmitVertex();

	EndPrimitive();
}