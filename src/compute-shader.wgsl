struct Body {
  position: vec3<f32>,
  velocity: vec3<f32>,
  mass: f32,
}

@group(0) @binding(0) var<storage, read> input : array<Body>;
@group(0) @binding(1) var<storage, read_write> output : array<Body>;


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
  let radius: f32 =2;
  let gravity = vec3<f32>(0, 1, 0);
  let wind = vec3<f32>(0.0, 0, 0);

  let bodies_count = arrayLength(&output);
  let body_index = global_id.x * (global_id.y + 1) * (global_id.z + 1);
  
  if(body_index >= bodies_count) {
    return;
  }

  var prev_state = input[body_index];
  let next_state = &output[body_index];

  (*next_state) = prev_state;


  // for (var i: u32 = 0; i < bodies_count; i = i + 1) {
  //   if (i == body_index) {
  //     continue;
  //   }

  //   var other_entity = input[i];
  //   var position_to_position = (*next_state).position - other_entity.position;
  //   var dist = length(position_to_position);

  //   if (dist > radius * 2) {
  //     continue;
  //   }

  //   let overlap = radius * 2 - dist;
  //   (*next_state).position = (*next_state).position + normalize(position_to_position) * overlap * 0.5;


  //   // // some pretty dodgy maths here i think...
  //   let incidental_velocity = other_entity.velocity;
  //   if (length(incidental_velocity) == 0 || length((*next_state).velocity) == 0) {
  //     continue;
  //   }
  //   let incidental_dir = normalize(incidental_velocity);
  //   let entity_dir = normalize((*next_state).velocity);
  //   let half = normalize(incidental_dir + entity_dir);
  //   let incidental_normal = cross(half, vec3<f32>(0, 0, 1));
  //   (*next_state).velocity = reflect((*next_state).velocity,  incidental_normal);
  // }
  
  var acceleration = vec3<f32>(0);
  var weight : vec3<f32> = gravity * (*next_state).mass;
  acceleration = apply_force((*next_state), acceleration, wind);
  acceleration = apply_force((*next_state), acceleration, weight);

  
  var drag : vec3<f32> = calculate_drag((*next_state).velocity + acceleration, 0.1);
  acceleration = apply_force((*next_state), acceleration, drag);

  (*next_state).velocity = (*next_state).velocity + acceleration;
  (*next_state).position = (*next_state).position + (*next_state).velocity;

  // WALLS
  // TOP
  if ((*next_state).position.y < 0) {
    (*next_state).position.y = 0;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));
  }

  // BOTTOM
  if ((*next_state).position.y > 800) {
    (*next_state).position.y = 800;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(0, 1, 0));
  }

  // LEFT
  if ((*next_state).position.x > 1500) {
    (*next_state).position.x = 1500;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(-1, 0, 0));
  }

  // RIGHT
  if ((*next_state).position.x < 0) {
    (*next_state).position.x = 0;
    (*next_state).velocity = reflect((*next_state).velocity, vec3<f32>(1, 0, 0));
  }
}