import { Draggable } from "gsap/Draggable";
import { gsap } from "gsap";
import type InfiniteListAnimation from "./InfiniteListAnimation";

const moveListWithDraggable = (
  list: InfiniteListAnimation,
  draggable: HTMLElement
) => {
  const clampDelta = gsap.utils.clamp(-5000, 5000);
  let previousDrag = 0;
  Draggable.create(draggable, {
    type: "x",
    onPress: () => {
      list.grab();
    },
    onRelease: () => {
      list.release();
    },
    onDragStart: () => {
      previousDrag = parseFloat(gsap.getProperty(draggable, "x").toString());
    },
    onDrag: () => {
      const currentDrag = parseFloat(
        gsap.getProperty(draggable, "x").toString()
      );

      const delta = (currentDrag - previousDrag) * 50;

      list.move(clampDelta(delta));
      previousDrag = currentDrag;
    },
    onDragEnd: () => {
      gsap.set(draggable, { x: 0 });
    },
  });
};

export default moveListWithDraggable;
