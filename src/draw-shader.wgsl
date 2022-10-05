struct Body {
  position: vec3<f32>,
  velocity: vec3<f32>,
  mass: f32,
}

struct Uniforms {
  u_resolution : vec2<f32>,
  u_mouse : vec2<f32>,
}

@group(0) @binding(0) var<storage, read> input : array<Body>;
@group(0) @binding(2) var<uniform> uniforms : Uniforms;

struct VertexInput {
  @location(0) position : vec2<f32>,
  @location(1) uv : vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) uv : vec2<f32>,
}

fn ball_sdf(position : vec2<f32>, radius : f32, coords : vec2<f32>) -> f32 {
  var dst : f32 = radius / 2.0 / length(coords - position);
  return dst;
}

fn screen_space_to_clip_space(screen_space: vec2<f32>) -> vec2<f32> {
  var clip_space = ((screen_space / uniforms.u_resolution) * 2.0) - 1.0;
  clip_space.y = clip_space.y * -1;

  return clip_space;
}

@vertex
fn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  var radius : f32 = 1;
  var entity = input[instance_index];


  var screen_space_coords: vec2<f32> = vert.position.xy * radius + entity.position.xy;

  output.position = vec4<f32>(screen_space_to_clip_space(screen_space_coords), 0.0, 1.0);
  // output.uv = vert.uv;
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(1.0);
}