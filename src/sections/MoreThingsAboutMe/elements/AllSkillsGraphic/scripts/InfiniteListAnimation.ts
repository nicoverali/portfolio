import { gsap } from "gsap";

interface Options {
  elementsMargin: number;
  idleDuration: number;
}

export default class InfiniteListAnimation {
  private items: Array<Element>;
  private list: HTMLElement;
  private options: Options;

  private baseTween: gsap.core.Tween;
  private tweenTarget: number = 0;

  constructor(
    list: HTMLElement,
    items: Array<Element>,
    options?: Partial<Options>
  ) {
    this.items = items;
    this.list = list;
    this.options = {
      elementsMargin: options?.elementsMargin ?? 0,
      idleDuration: options?.idleDuration ?? 20,
    };

    this.extendListToFillContainer();
    this.baseTween = this.getBaseTween();
  }

  play() {
    this.tweenTarget = this.getTotalWidth();
    this.baseTween.play();
  }

  grab() {
    this.getFreezeTween().play();
  }

  move(deltaX: number) {
    this.getMoveTween().play();
    this.tweenTarget = deltaX;
    this.baseTween.timeScale(5);
    this.baseTween.vars.ease = "power1.out";
    this.baseTween.repeat(0);
    this.baseTween.invalidate();
    this.baseTween.restart();
  }

  release() {
    const releaseVelocity = this.tweenTarget;
    console.log("releaseVelocity: " + releaseVelocity);
    this.tweenTarget =
      this.getTotalWidth() * (Math.sign(this.tweenTarget) || 1);
    this.baseTween.vars.ease = "none";
    this.baseTween.repeat(-1);
    this.baseTween.invalidate();
    this.baseTween.restart();

    // if (this.baseTween.timeScale() == 0) {
    //   this.getFreezedToIdleTween().play();
    //   return;
    // }

    this.getReleaseVelocityToIdleTween(releaseVelocity).play();
  }

  private wrapXOnBounds(x: number, item: HTMLElement): number {
    const totalWidth = this.getTotalWidth();
    const itemCurrentLeft = item.offsetLeft + x;
    if (this.isGoingForward()) {
      return (itemCurrentLeft % totalWidth) - item.offsetLeft;
    }
    return (
      ((itemCurrentLeft - totalWidth) % totalWidth) -
      (item.offsetLeft - totalWidth)
    );
  }

  private isGoingForward(): boolean {
    return this.tweenTarget > 0;
  }

  private getTotalWidth(): number {
    return this.list.clientWidth + this.options.elementsMargin;
  }

  private extendListToFillContainer(): void {
    const parentWidth = this.list.parentElement?.clientWidth ?? 0;
    const widestElement = Math.max(...this.items.map((i) => i.clientWidth));

    const extraItems: Array<Element> = [];
    while (this.list.clientWidth < parentWidth + widestElement) {
      this.items.forEach((i) => {
        const clone = i.cloneNode(true) as Element;
        this.list.appendChild(clone);
        extraItems.push(clone);
      });
    }

    this.items = this.items.concat(extraItems);
  }

  private getBaseTween(): gsap.core.Tween {
    return gsap.to(this.items, {
      x: () => {
        console.log("Calculated x: " + this.tweenTarget);
        return `+=${this.tweenTarget}`;
      },
      ease: "none",
      duration: this.options.idleDuration,
      repeat: -1,
      paused: true,
      modifiers: {
        x: (x, item) => this.wrapXOnBounds(parseFloat(x), item) + "px",
      },
    });
  }

  private getMoveTween(): gsap.core.Tween {
    return gsap.to(this.baseTween, {
      timeScale: 10,
      duration: 0.5,
      overwrite: true,
      ease: "power3.in",
      paused: true,
    });
  }

  private getReleaseVelocityToIdleTween(velocity: number): gsap.core.Tween {
    return gsap.fromTo(
      this.baseTween,
      {
        timeScale:
          this.baseTween.timeScale() *
          (Math.abs(velocity) / this.getTotalWidth()),
      },
      {
        timeScale: 1,
        duration: 5,
        overwrite: true,
        ease: "power4.out",
        paused: true,
        onUpdate: () => {
          console.log(
            "Releasing, timeScale: " +
              this.baseTween.timeScale() +
              ", duration: " +
              this.baseTween.duration() +
              ", x: " +
              JSON.stringify(this.baseTween.vars)
          );
        },
      }
    );
  }

  private getFreezeTween(): gsap.core.Tween {
    return gsap.to(this.baseTween, {
      timeScale: 0,
      ease: "power3.out",
      duration: 2,
      overwrite: true,
      paused: true,
    });
  }

  private getFreezedToIdleTween(): gsap.core.Tween {
    this.tweenTarget =
      this.getTotalWidth() * (Math.sign(this.tweenTarget) || 1);
    this.baseTween.vars.ease = "none";
    return gsap.to(this.baseTween, {
      timeScale: 1,
      duration: 1,
      ease: "power2.in",
      overwrite: true,
      paused: true,
    });
  }
}
