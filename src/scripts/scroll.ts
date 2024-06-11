import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis;

export interface Scroll {
  top: number;
  left: number;
}

export const setupLenis = () => {
  lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};

export const getCurrentScroll = (): Scroll => {
  return {
    top:
      window.pageYOffset ||
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop,
    left:
      window.pageXOffset ||
      window.scrollX ||
      document.documentElement.scrollLeft ||
      document.body.scrollLeft,
  };
};

export const scrollTo = (target: number | string | HTMLElement) => {
  lenis.scrollTo(target);
};

export const toggleScroll = (active?: boolean) => {
  if (active != null) {
    return active ? lenis.start() : lenis.stop();
  }
  lenis.isStopped ? lenis.start() : lenis.stop();
};

export const onScroll = (callback: (scroll: Scroll) => void) => {
  if (lenis) {
    lenis.on("scroll", () => callback(getCurrentScroll()));
  } else {
    document.addEventListener("scroll", () => callback(getCurrentScroll()));
  }
};
