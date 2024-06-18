import CustomEase from "gsap/CustomEase";

interface EaseInWiggleEasingOptions {
  oscillations?: number;
  friction?: number;
  initialAmplitude?: number;
}

export default class EaseInWiggleEasing {
  private static getPath(
    friction: number = 0.5,
    initialAmplitude: number = 0.5,
    oscillations?: number
  ) {
    if (!oscillations) {
      oscillations = this.calculateNumberOfOscillations(
        friction,
        initialAmplitude
      );
    }

    let pathData = `M 0,0 C 0.05,0 0.264,-0.02 0.37,0.191 0.462,0.394 0.5,${
      1 - initialAmplitude
    } 0.5,1`;

    // Sinusoidal wave segment
    let step = 0.5 / oscillations;
    let amplitude = initialAmplitude;

    for (let i = 0; i < oscillations; i++) {
      // First half of the oscillation (top peak)
      let x1 = 0.5 + (i + 0.25) * step;
      let y1 = 1 + amplitude;
      let x2 = 0.5 + (i + 0.5) * step;
      pathData += ` C ${x1},${y1} ${x1},${y1} ${x2},1`;

      // Reduce amplitude for the next peak
      amplitude *= 1 - friction;

      // Second half of the oscillation (bottom peak)
      let x3 = 0.5 + (i + 0.75) * step;
      let y2 = 1 - amplitude;
      let x4 = 0.5 + (i + 1) * step;
      pathData += ` C ${x3},${y2} ${x3},${y2} ${x4},1`;
    }

    return pathData;
  }

  private static calculateNumberOfOscillations(
    friction: number,
    amplitude: number
  ): number {
    return Math.ceil(Math.log(0.01 / amplitude) / Math.log(friction));
  }

  static create(options: EaseInWiggleEasingOptions): gsap.EaseFunction {
    return CustomEase.create(
      "",
      this.getPath(
        options.friction,
        options.initialAmplitude,
        options.oscillations
      )
    );
  }
}
