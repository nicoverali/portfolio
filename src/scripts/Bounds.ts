import type { Scroll } from "@scripts/scroll";

interface RawBounds {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

interface Padding {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

interface DrawOptions {
  id?: string;
  color?: string;
  label?: string;
  labelColor?: string;
}

export default class Bounds {
  private raw: RawBounds;

  constructor(bounds: RawBounds) {
    this.raw = bounds;
  }

  draw(options: DrawOptions = {}) {
    const { top, left, bottom, right } = this.raw;
    const { id, color = "red", label } = options;

    const width = right - left;
    const height = bottom - top;

    const rectElement = id
      ? document.getElementById(id) ?? document.createElement("div")
      : document.createElement("div");
    rectElement.id = id ?? "";
    rectElement.style.position = "absolute";
    rectElement.style.top = `${top}px`;
    rectElement.style.left = `${left}px`;
    rectElement.style.width = `${width}px`;
    rectElement.style.height = `${height}px`;
    rectElement.style.border = `2px solid ${color}`;
    rectElement.style.pointerEvents = "none";

    if (label) {
      const labelElement = id
        ? document.getElementById(`${id}-label`) ??
          document.createElement("div")
        : document.createElement("div");

      labelElement.id = id ? `${id}-label` : "";
      labelElement.style.position = "absolute";
      labelElement.style.top = `${top - 20}px`; // Position above the rectangle
      labelElement.style.left = `${left}px`;
      labelElement.style.color = color;
      labelElement.style.fontSize = "12px";
      labelElement.textContent = label;
      rectElement.style.pointerEvents = "none";
      document.body.appendChild(labelElement);
    }

    document.body.appendChild(rectElement);
  }

  pad(padding: number | Padding) {
    if (typeof padding === "number") {
      return new Bounds({
        top: this.raw.top - padding,
        left: this.raw.left - padding,
        bottom: this.raw.bottom + padding,
        right: this.raw.right + padding,
      });
    }
    return new Bounds({
      top: this.raw.top - (padding.top ?? 0),
      left: this.raw.left - (padding.left ?? 0),
      bottom: this.raw.bottom + (padding.bottom ?? 0),
      right: this.raw.right + (padding.right ?? 0),
    });
  }

  adjustByScroll(scroll: Scroll) {
    return new Bounds({
      top: this.raw.top + scroll.top,
      left: this.raw.left + scroll.left,
      bottom: this.raw.bottom + scroll.top,
      right: this.raw.right + scroll.left,
    });
  }

  intersects(other: Bounds): boolean {
    return (
      this.raw.left <= other.getRight() &&
      other.getLeft() <= this.raw.right &&
      this.raw.top <= other.getBottom() &&
      other.getTop() <= this.raw.bottom
    );
  }

  getTop(): number {
    return this.raw.top;
  }

  getBottom(): number {
    return this.raw.bottom;
  }

  getLeft(): number {
    return this.raw.left;
  }

  getRight(): number {
    return this.raw.right;
  }
}
