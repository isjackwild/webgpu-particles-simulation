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
@group(0) @binding(1) var<storage, read_write> output : array<Body>;
@group(1) @binding(0) var<uniform> uniforms : Uniforms;


fn calculate_drag(velocity: vec3<f32>, coefficient: f32) -> vec3<f32> {
  let speed = length(velocity);

  if (speed == 0.0) {
    return vec3(0);
  }

  let speed_squared = speed * speed;
  let direction = normalize(velocity) * -1;

  return coefficient * speed_squared * direction;
}

fn apply_force(body: Body, acceleration: vec3<f32>, force: vec3<f32>) -> vec3<f32> {
  return acceleration + (force / body.mass);
}

fn check_colissions(dst : ptr<function, Body>) {
  (*dst).position = (*dst).position;
  (*dst).velocity = (*dst).velocity;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  const PI: f32 = 3.14159;

  let radius: f32 = 1;
  let mouse_radius: f32 = 200;
  let gravity = vec3<f32>(0, 0, 0);
  let wind = vec3<f32>(0, 0, 0);

  let bodies_count = arrayLength(&output);
  let body_index = global_id.x * (global_id.y + 1) * (global_id.z + 1);
  
  if(body_index >= bodies_count) {
    return;
  }

  var prev_state = input[body_index];
  let next_state = &output[body_index];

  (*next_state) = prev_state;

  var acceleration = vec3<f32>(0);


  // var position_to_mouse: vec3<f32> = (*next_state).position - vec3<f32>(uniforms.u_mouse, 0.0);
  // var dist = length(position_to_mouse);
  // if (dist < radius + mouse_radius) {
  //   let overlap = radius + mouse_radius - dist;
  //   (*next_state).position = (*next_state).position + normalize(position_to_mouse) * overlap;

  //   var incidence = normalize(position_to_mouse);
  //   var normal = cross(incidence, vec3<f32>(0, 0, 1));
  //   (*next_state).velocity = reflect((*next_state).velocity,  normal) * 1.2;
  // }

  var position_to_mouse: vec3<f32> = (*next_state).position - vec3<f32>(uniforms.u_mouse, 0.0);
  var dist = length(position_to_mouse);
  if (dist < mouse_radius) {
    var repel_direction = normalize(position_to_mouse);
    var repel_force = 1 - dist / mouse_radius;
    repel_force = repel_force * repel_force;

    acceleration = apply_force((*next_state), acceleration, repel_direction * repel_force);
  }


  
  var weight : vec3<f32> = gravity * (*next_state).mass;
  acceleration = apply_force((*next_state), acceleration, wind);
  acceleration = apply_force((*next_state), acceleration, weight);

  
  var drag : vec3<f32> = calculate_drag((*next_state).velocity + acceleration, 0.01);
  acceleration = apply_force((*next_state), acceleration, drag);

  (*next_state).velocity = (*next_state).velocity + acceleration;
  (*next_state).position = (*next_state).position + (*next_state).velocity;

  (*next_state).position.z = 0.9 - (step(0.01, length((*next_state).velocity)) * 0.1); // moving pixels render on top
  
  // WALLS
  // TOP
  if ((*next_state).position.y < 0) {
    (*next_state).position.y = 0;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));
  }

  // BOTTOM
  if ((*next_state).position.y > uniforms.u_resolution.y) {
    (*next_state).position.y = uniforms.u_resolution.y;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));
  }

  // LEFT
  if ((*next_state).position.x > uniforms.u_resolution.x) {
    (*next_state).position.x = uniforms.u_resolution.x;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(-1, 0, 0));
  }

  // RIGHT
  if ((*next_state).position.x < 0) {
    (*next_state).position.x = 0;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(1, 0, 0));
  }
}