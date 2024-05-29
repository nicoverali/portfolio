import type { Scroll } from "@scripts/scroll";
import Bounds from "@scripts/Bounds";
import GooeyContainer from "@components/Gooey/scripts/GooeyContainer";

export default class VirtualCursor {
  private cursor: Element;
  private actualCursorX: number = 0;
  private actualCursorY: number = 0;
  private currentScroll: Scroll = { top: 0, left: 0 };
  private gooeyContainers: Array<GooeyContainer>;

  constructor(cursorEl: Element, gooeyContainers?: Array<GooeyContainer>) {
    this.cursor = cursorEl;
    this.gooeyContainers = gooeyContainers || [];
  }

  updateActualCursor(x: number, y: number) {
    this.actualCursorX = x;
    this.actualCursorY = y;
  }

  updateScroll(scroll: Scroll) {
    this.currentScroll = scroll;
  }

  update() {
    this.updateCursorContainer();
    this.updateCursorPosition();
  }

  private updateCursorContainer() {
    const gooeyContainerEl =
      document.querySelector<HTMLElement>(".gooey-container");
    if (!gooeyContainerEl) return;

    const gooeyContainer = new GooeyContainer(gooeyContainerEl, {
      debug: true,
    });
    const gooeyBounds = gooeyContainer
      .getTriggerBoundsInViewport()
      .adjustByScroll(this.currentScroll);
    const cursorBounds = this.getActualCursorBoundsInViewport().adjustByScroll(
      this.currentScroll
    );

    cursorBounds.draw({ id: "DEBUG-cursor" });

    if (gooeyBounds.intersects(cursorBounds)) {
      if (this.cursor.parentNode !== gooeyContainerEl) {
        gooeyContainerEl.appendChild(this.cursor);
      }
    } else {
      if (this.cursor.parentNode !== document.body) {
        document.body.appendChild(this.cursor);
      }
    }
  }

  private updateCursorPosition() {
    const actualCursorBounds = this.getActualCursorBoundsInViewport();
    const offset = this.cursor.parentElement?.getBoundingClientRect();
    const offsetX = Math.max(offset?.left, 0);
    const offsetY = Math.max(offset?.top, 0);

    const cursorLeft = actualCursorBounds.getLeft() - offsetX;
    const cursorTop = actualCursorBounds.getTop() - offsetY;
    this.cursor.style.left = cursorLeft + "px";
    this.cursor.style.top = cursorTop + "px";
  }

  private getActualCursorBoundsInViewport(): Bounds {
    return new Bounds({
      bottom: this.actualCursorY + this.cursor.clientHeight / 2,
      top: this.actualCursorY - this.cursor.clientHeight / 2,
      left: this.actualCursorX - this.cursor.clientWidth / 2,
      right: this.actualCursorX + this.cursor.clientWidth / 2,
    });
  }
}
