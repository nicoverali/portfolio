import { gsap } from "gsap";
import { getRotationOf } from "@scripts/utils/gsap";

const MAX_INERTIA = 360;

interface Options {
  speed: number;
  maxRotation: number;
  pushRotation: number;
}

export default class CircleRotationAnimation {
  private element: HTMLElement;
  private tween: gsap.core.Tween;
  private options: Options;

  private target: number = 0;
  private center: number = 0;

  private isGrabbing: boolean = false;
  private isGoingBack: boolean = false;

  constructor(element: HTMLElement, options: Options) {
    this.element = element;
    this.options = options;

    this.tween = gsap.to(this.element, {
      rotate: () => {
        return this.target;
      },
      onComplete: () => {
        if (this.isGrabbing) return;
        if (this.getRotation() === 0) {
          return;
        }

        this.target = this.isGoingBack
          ? this.center
          : this.midpoint(this.getRotation(), this.center);

        const ease = this.isGoingBack ? "elastic.out(0.5, 0.4)" : "power3.in";

        this.isGoingBack = !this.isGoingBack;

        this.restart(ease);
      },
      duration: options.speed ?? 1,
      paused: true,
    });
  }

  grab() {
    const newTarget = this.midpoint(this.target, this.getRotation());
    this.target = newTarget;

    this.restart("power3.out");
    this.isGrabbing = true;
    this.isGoingBack = false;
  }

  move(rotation: number) {
    if (Math.abs(rotation) < 0.1) return;
    const newTarget = this.target + rotation;
    this.target = Math.min(
      Math.max(newTarget, this.getNegativeBound()),
      this.getPositiveBound()
    );
    this.restart("power3.out");
  }

  release() {
    this.isGrabbing = false;
  }

  push(direction: number) {
    const rotation = (this.options.pushRotation ?? 20) * direction;

    this.target = this.isGoingBack
      ? this.center + rotation
      : this.target + rotation;
    this.restart("power3.out");
  }

  private midpoint(rot1: number, rot2: number) {
    return (rot1 + rot2) / 2;
  }

  private getRotation(): number {
    return getRotationOf(this.element) - this.center;
  }

  private getNegativeBound(): number {
    return this.center - MAX_INERTIA;
  }

  private getPositiveBound(): number {
    return this.center + MAX_INERTIA;
  }

  private restart(ease?: gsap.EaseString) {
    if (ease) {
      this.tween.vars.ease = ease;
    }
    this.tween.invalidate();
    this.tween.restart();
  }
}
