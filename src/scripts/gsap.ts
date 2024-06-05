import { gsap } from "gsap";
import { SlowMo } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

export const setupGSAP = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SlowMo);
  gsap.registerPlugin(Draggable);
};
