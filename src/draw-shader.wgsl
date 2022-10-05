struct Body {
  position: vec3<f32>,
  velocity: vec3<f32>,
  mass: f32,
}
@group(0) @binding(0) var<storage, read> input : array<Body>;

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

@vertex
fn vertex_main(vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = vec4<f32>(vert.position.xy, 0.0, 1.0);
  output.uv = vert.uv;
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let bodies_count = arrayLength(&input);

  let coords: vec2<f32> = in.uv * vec2<f32>(1512, 865);

  var color = vec3<f32>(0);
  // color = color + ball_sdf(vec2<f32>(100, 100), 8, coords).rgb;

  for (var i: u32 = 0; i < bodies_count; i = i + 1) {
    var entity = input[i];
    var sdf = ball_sdf(entity.position.xy, 8, coords);

    var a = step(1.0, sdf);
    
    color = color + a;
  }

  return vec4<f32>(color, 1.0);
}