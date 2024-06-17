import CustomEase from "gsap/CustomEase";

export default class WiggleEasing {
  private static getWigglePath(friction: number = 0.5, oscillations?: number) {
    let amplitude = 1;

    if (!oscillations) {
      oscillations = this.calculateNumberOfOscillations(friction, 1);
      console.log(oscillations);
    }

    let pathData = "M 0,0";
    let step = 1 / oscillations;

    for (let i = 0; i < oscillations; i++) {
      // First half of the oscillation
      let x1 = (i + 0.25) * step;
      let y1 = amplitude;
      let x2 = (i + 0.5) * step;
      pathData += ` C ${x1},${y1} ${x1},${y1} ${x2},0`;

      // Reduce amplitude for the next peak
      amplitude *= 1 - friction;

      // Second half of the oscillation
      let x3 = (i + 0.75) * step;
      let y2 = -amplitude;
      let x4 = (i + 1) * step;
      pathData += ` C ${x3},${y2} ${x3},${y2} ${x4},0`;
    }

    return pathData;
  }

  private static calculateNumberOfOscillations(
    friction: number,
    amplitude: number
  ): number {
    return Math.ceil(Math.log(0.01 / amplitude) / Math.log(friction));
  }

  static create(friction?: number, oscillations?: number): gsap.EaseFunction {
    return CustomEase.create("", this.getWigglePath(friction, oscillations));
  }
}
