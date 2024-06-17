import { gsap } from "gsap";
import { SlowMo } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import CustomEase from "gsap/CustomEase";

export const setupGSAP = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SlowMo);
  gsap.registerPlugin(CustomEase);
  gsap.registerPlugin(Draggable);
};
