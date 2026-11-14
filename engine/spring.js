/**
 * Damped spring used for press feedback and pointer inertia.
 * The loop stops as soon as both velocity and distance are negligible.
 */
export class Spring {
  constructor(value = 0, stiffness = 180, damping = 22) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.settled = true;
  }

  setTarget(target) {
    this.target = target;
    this.settled = false;
  }

  update(dt) {
    if (this.settled) return false;
    const step = Math.min(0.05, Math.max(0.001, dt));
    const acceleration = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += acceleration * step;
    this.value += this.velocity * step;
    if (Math.abs(this.value - this.target) < 0.0005 && Math.abs(this.velocity) < 0.002) {
      this.value = this.target;
      this.velocity = 0;
      this.settled = true;
    }
    return !this.settled;
  }
}
