import { gsap } from "gsap";

export const vhPercent = (percent: number): number => {
  return window.innerHeight * (percent / 100);
};

export const getRotationOf = (element: HTMLElement): number => {
  return gsap.getProperty(element, "rotation") as number;
};
