import type { Scroll } from "@scripts/scroll";
import Bounds from "@scripts/Bounds";
import GooeyContainer from "@components/Gooey/scripts/GooeyContainer";

export default class VirtualCursor {
  private cursor: HTMLElement;
  private realCursorX: number = 0;
  private realCursorY: number = 0;
  private currentScroll: Scroll = { top: 0, left: 0 };
  private gooeyContainers: Array<GooeyContainer>;
  private currentContainer?: GooeyContainer;

  constructor(cursorEl: HTMLElement, gooeyContainers?: Array<GooeyContainer>) {
    this.cursor = cursorEl;
    this.gooeyContainers = gooeyContainers || [];
  }

  updateRealCursor(x: number, y: number) {
    this.realCursorX = x;
    this.realCursorY = y;
    this.updateVirtualCursor();
  }

  updateScroll(scroll: Scroll) {
    this.currentScroll = scroll;
    this.updateVirtualCursor();
  }

  private updateVirtualCursor() {
    this.updateCursorContainer();
    this.updateCursorPosition();
  }

  private updateCursorContainer() {
    if (this.stillIntersectsContainer()) {
      return;
    }

    const cursorBounds = this.getRealCursorBoundsInViewport();
    for (const container of this.gooeyContainers) {
      const gooeyBounds = container.getTriggerBoundsInViewport();

      if (!gooeyBounds.intersects(cursorBounds)) continue;

      container.appendChild(this.cursor);
      this.currentContainer = container;
      return;
    }

    this.currentContainer = undefined;
    document.body.appendChild(this.cursor);
  }

  private stillIntersectsContainer(): boolean {
    return (
      this.currentContainer
        ?.getTriggerBoundsInViewport()
        .intersects(this.getRealCursorBoundsInViewport()) ?? false
    );
  }

  private updateCursorPosition() {
    const realCursorBounds = this.getRealCursorBoundsInViewport();
    const realCursorTop = realCursorBounds.getTop();
    const realCursorLeft = realCursorBounds.getLeft();

    realCursorBounds
      .adjustByScroll(this.currentScroll)
      .draw({ id: "DEBUG-cursor" });

    if (this.currentContainer == null) {
      this.cursor.style.position = "fixed";
      this.cursor.style.left = realCursorLeft + "px";
      this.cursor.style.top = realCursorTop + "px";
      return;
    }

    const containerBounds = this.currentContainer.getContentBoundsInViewport();
    this.cursor.style.position = "absolute";
    this.cursor.style.left = realCursorLeft - containerBounds.getLeft() + "px";
    this.cursor.style.top = realCursorTop - containerBounds.getTop() + "px";
  }

  private getRealCursorBoundsInViewport(): Bounds {
    return new Bounds({
      bottom: this.realCursorY + this.cursor.clientHeight / 2,
      top: this.realCursorY - this.cursor.clientHeight / 2,
      left: this.realCursorX - this.cursor.clientWidth / 2,
      right: this.realCursorX + this.cursor.clientWidth / 2,
    });
  }
}
