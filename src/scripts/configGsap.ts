import { gsap } from "gsap";
import { SlowMo } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const configGsap = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SlowMo);
};
