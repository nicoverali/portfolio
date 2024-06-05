import { Draggable } from "gsap/Draggable";
import { gsap } from "gsap";
import { getRotationOf } from "@scripts/utils/gsap";
import type CircleRotationAnimation from "./CircleRotationAnimation";

const rotateCirclesBasedOnDraggable = (
  draggable: HTMLElement,
  circles: Array<CircleRotationAnimation>
) => {
  let previousRotation = 0;

  Draggable.create(draggable, {
    type: "rotation",
    cursor: "none",
    onPress: () => {
      circles.forEach((circle) => circle.grab());
    },
    onRelease: () => {
      circles.forEach((circle) => {
        circle.release();
      });
    },
    onDragStart: () => {
      previousRotation = getRotationOf(draggable);
    },
    onDrag: (e) => {
      circles.forEach((circle) =>
        circle.move((getRotationOf(draggable) - previousRotation) * 0.4)
      );
      previousRotation = getRotationOf(draggable);
    },
    onDragEnd: () => {
      circles.forEach((circle) => {
        circle.release();
      });

      gsap.set(draggable, { rotation: 0 });
    },
  });
};

export default rotateCirclesBasedOnDraggable;
