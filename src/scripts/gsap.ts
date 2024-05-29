import { gsap } from "gsap";
import { SlowMo } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const setupGSAP = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SlowMo);
};
