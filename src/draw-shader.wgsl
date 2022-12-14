struct Body {
  position: vec3<f32>,
  velocity: vec3<f32>,
  texture_uv: vec2<f32>,
  mass: f32,
}

struct Uniforms {
  u_resolution : vec2<f32>,
  u_mouse : vec2<f32>,
}

@group(0) @binding(0) var<storage, read> input : array<Body>;
@group(1) @binding(0) var<uniform> uniforms : Uniforms;
@group(2) @binding(0) var mySampler: sampler;
@group(2) @binding(1) var myTexture: texture_2d<f32>;

struct VertexInput {
  @location(0) position : vec2<f32>,
  @location(1) texture_uv : vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) texture_uv : vec2<f32>,
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

fn quantize(value: f32, q_step: f32) -> f32 {
  return round(value / q_step) * q_step;
}

@vertex
fn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  var radius : f32 = 0.5;
  var entity = input[instance_index];

  var screen_space_coords: vec2<f32> = vert.position.xy * radius + entity.position.xy;
  output.position = vec4<f32>(screen_space_to_clip_space(screen_space_coords), entity.position.z, 1.0);
  output.texture_uv = entity.texture_uv;
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {

  var color = textureSample(myTexture, mySampler, in.texture_uv);
  return vec4<f32>(color.rgb, 1.0);
}