import { Draggable } from "gsap/Draggable";
import { gsap } from "gsap";
import type InfiniteListAnimation from "./InfiniteListAnimation";

const moveListWithDraggable = (
  list: InfiniteListAnimation,
  draggable: HTMLElement
) => {
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
      list.move((currentDrag - previousDrag) * 50);
      previousDrag = currentDrag;
    },
    onDragEnd: () => {
      gsap.set(draggable, { x: 0 });
    },
  });
};

export default moveListWithDraggable;
