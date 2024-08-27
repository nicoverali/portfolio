import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollTarget = number | string | HTMLElement;

let lenis: Lenis;
let scrollToTarget: ScrollTarget | null;

export interface Scroll {
  top: number;
  left: number;
}

export const setupLenis = () => {
  console.log("Setting up lenis");
  if (lenis != null) return;

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

export const scrollTo = (target: ScrollTarget) => {
  if (lenis.isStopped) {
    scrollToTarget = target;
    return;
  }
  lenis.scrollTo(target, { duration: 1.5 });
};

export const toggleScroll = (active?: boolean) => {
  if (!lenis) return;

  const shouldStart = active ?? lenis.isStopped;

  if (!shouldStart) {
    lenis.stop();
    return;
  }

  lenis.start();
  if (scrollToTarget) {
    lenis.scrollTo(scrollToTarget, { duration: 1.5 });
    scrollToTarget = null;
  }
};

export const onScroll = (callback: (scroll: Scroll) => void) => {
  if (lenis) {
    lenis.on("scroll", () => callback(getCurrentScroll()));
  } else {
    document.addEventListener("scroll", () => callback(getCurrentScroll()));
  }
};
