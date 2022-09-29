struct Entity {
  value: vec3<f32>,
  velocity: vec3<f32>,
}

@group(0) @binding(0) var<storage, read> input : array<Entity>;
@group(0) @binding(1) var<storage, read_write> output : array<Entity>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {

  let entities_count = arrayLength(&output);
  let entity_index = global_id.x * (global_id.y + 1) * (global_id.z + 1);
  
  if(entity_index >= entities_count) {
    return;
  }

  var src = input[entity_index];
  let dst = &output[entity_index];

  (*dst) = src;
  
  (*dst).value.x = (*dst).value.x + (*dst).velocity.x;
  (*dst).value.y = (*dst).value.y + (*dst).velocity.y;
  (*dst).value.y = (*dst).value.y + (*dst).velocity.y;
}