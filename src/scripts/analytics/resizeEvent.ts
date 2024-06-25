import { triggerEvent } from "./analytics";

let resizeTimeout: NodeJS.Timeout;
let lastWidth: number = window.innerWidth;

const trackResizeEvent = () => {
  window.addEventListener("resize", () => {
    if (lastWidth === window.innerWidth) return;

    lastWidth = window.innerWidth;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      triggerEvent({
        name: "window-resized",
        payload: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    }, 1000);
  });
};

export default trackResizeEvent;
