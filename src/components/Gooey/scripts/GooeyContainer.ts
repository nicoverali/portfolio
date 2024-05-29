import Bounds from "@scripts/Bounds";
import { getCurrentScroll } from "@scripts/scroll";
import {
  GOOEY_CAMEL_ATTR_DEBUG_ID,
  GOOEY_CAMEL_ATTR_PADDING,
  GOOEY_CLASS_NAME,
} from "./attributes";

interface GooeyContainerOptions {
  debug?: boolean;
}

export default class GooeyContainer {
  private id?: string;
  private element: HTMLElement;

  constructor(element: HTMLElement, options?: GooeyContainerOptions) {
    if (!element.classList.contains(GOOEY_CLASS_NAME)) {
      console.warn(
        "Trying to create a GooeyContainer with an element that doesn't have the expected GooeyContainer class"
      );
    }
    this.element = element;
    this.id = element.dataset[GOOEY_CAMEL_ATTR_DEBUG_ID];

    if (options?.debug) {
      setInterval(() => {
        const currentScroll = getCurrentScroll();
        this.getContentBoundsInViewport()
          .adjustByScroll(currentScroll)
          .draw({
            id: this.id && `DEBUG-${this.id}-CONTENT`,
            label: this.id && `${this.id}-CONTENT`,
            color: "green",
          });
        this.getTriggerBoundsInViewport()
          .adjustByScroll(currentScroll)
          .draw({
            id: this.id && `DEBUG-${this.id}-TRIGGER`,
            label: this.id && `${this.id}-TRIGGER`,
            color: "red",
          });
      }, 1000);
    }
  }

  appendChild(el: Element) {
    this.element.appendChild(el);
  }

  getContentBoundsInViewport(): Bounds {
    return new Bounds(this.element.getBoundingClientRect());
  }

  getTriggerBoundsInViewport(): Bounds {
    const padding = this.getTriggerPadding();
    return this.getContentBoundsInViewport().pad(padding);
  }

  private getTriggerPadding(): number {
    const padding = this.element.dataset[GOOEY_CAMEL_ATTR_PADDING];
    if (!padding) return 0;

    const parsed = parseFloat(padding);
    if (isNaN(parsed)) return 0;

    return parsed;
  }
}
