import WiggleEasing from "./WiggleEasing";
import { gsap } from "gsap";
import EaseInWiggleEasing from "./EaseInWiggleEasing";

interface AnimationOptions {
  friction?: number;
  speed?: number;
}

export default class CircleAnimation {
  private circle: HTMLElement;
  private speed: number;
  private friction: number;
  private rotateTo: gsap.QuickToFunc;
  private idle: boolean = true;

  private easeInWiggleEase: gsap.EaseFunction;
  private wiggleEase: gsap.EaseFunction;

  constructor(circle: HTMLElement, options?: AnimationOptions) {
    this.circle = circle;
    this.speed = options?.speed ?? 1;
    this.friction = gsap.utils.clamp(0.05, 1, options?.friction ?? 0.5);
    this.rotateTo = this.getBaseAnimation(circle);

    this.easeInWiggleEase = EaseInWiggleEasing.create({
      friction: this.friction,
      initialAmplitude: 0.2,
    });
    this.wiggleEase = WiggleEasing.create(0.6);

    this.setWiggleState(this.rotateTo);
  }

  private getBaseAnimation(circle: HTMLElement): gsap.QuickToFunc {
    return gsap.quickTo(circle, "rotation", {
      duration: this.speed,
    });
  }

  private setWiggleState(anim: gsap.QuickToFunc) {
    anim.tween.vars.ease = this.wiggleEase;
    anim.tween.timeScale(1);
    anim.tween.invalidate();
  }

  private setReleaseState(anim: gsap.QuickToFunc) {
    anim.tween.vars.ease = this.easeInWiggleEase;
    anim.tween.timeScale(0.8);
    anim.tween.invalidate();
  }

  private setMoveState(anim: gsap.QuickToFunc) {
    anim.tween.vars.ease = "power3.out";
    anim.tween.timeScale(4);
    anim.tween.invalidate();
  }

  getRotation(): number {
    return gsap.getProperty(this.circle, "rotation") as number;
  }

  isIdle(): boolean {
    return this.idle;
  }

  wiggle() {
    this.rotateTo(30, 0);
  }

  grab() {
    this.idle = false;
    this.setMoveState(this.rotateTo);
  }

  move(to: number) {
    this.rotateTo(to);
  }

  release() {
    this.rotateTo.tween
      .then(() => {
        this.setReleaseState(this.rotateTo);
        return this.rotateTo(0);
      })
      .then(() => {
        this.rotateTo.tween.then(() => {
          this.setWiggleState(this.rotateTo);
          this.idle = true;
        });
      });
  }
}
