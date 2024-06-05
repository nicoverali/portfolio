import type CircleRotationAnimation from "./CircleRotationAnimation";

const pushCirclesOnMouseEnter = (
  container: HTMLElement,
  circles: Array<CircleRotationAnimation>
) => {
  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top;
  const containerBottom = containerRect.bottom;
  const containerLeft = containerRect.left;
  const containerWidth = containerRect.width;

  container.addEventListener("mouseenter", (e: MouseEvent) => {
    // If closer to sides then increase push
    const normalizedX = distance(e.x, containerLeft) / containerWidth;

    const invertIfTop =
      distance(e.y, containerTop) < distance(e.y, containerBottom) ? -1 : 1;

    const direction = 2 * (0.5 - normalizedX) * invertIfTop;

    circles.forEach((circle) => circle.push(direction));
  });
};

const distance = (a: number, b: number): number => {
  return Math.abs(a - b);
};

export default pushCirclesOnMouseEnter;
