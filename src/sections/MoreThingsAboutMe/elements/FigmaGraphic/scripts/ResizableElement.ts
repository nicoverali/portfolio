type ResizeOrigin = "topleft" | "topright" | "bottomleft" | "bottomright";

interface HandlerElementDataset {
  resizeDir?: ResizeOrigin;
}

interface ResizableElementProps {
  bounds: HTMLElement;
  element: HTMLElement;
  handlers: Array<HTMLElement>;
}

interface ResizeInitialState {
  resizeOrigin: ResizeOrigin;
  mouseX: number;
  mouseY: number;
  height: number;
  minHeight: number;
  maxHeight: number;
  width: number;
  minWidth: number;
  maxWidth: number;
  aspectRatio: AspectRatio;
  top: number;
  left: number;
  flippedX: boolean;
  flippedY: boolean;
}

interface UpdatedSize {
  height: number;
  width: number;
}

type OnResizeCallback = (e: HTMLElement) => void;

export default class ResizableElement {
  private element: HTMLElement;
  private bounds: HTMLElement;
  private handlers: Array<HTMLElement>;

  private startState!: ResizeInitialState;
  private evenResize: boolean = false;

  private resizeStartListeners: OnResizeCallback[] = [];
  private resizeListeners: OnResizeCallback[] = [];
  private resizeEndListeners: OnResizeCallback[] = [];

  constructor(props: ResizableElementProps) {
    this.element = props.element;
    this.bounds = props.bounds;
    this.handlers = props.handlers;

    this.setupListeners();
  }

  onResizeStart(cb: OnResizeCallback) {
    this.resizeStartListeners.push(cb);
  }

  onResize(cb: OnResizeCallback) {
    this.resizeListeners.push(cb);
  }

  onResizeEnd(cb: OnResizeCallback) {
    this.resizeEndListeners.push(cb);
  }

  private setupListeners() {
    document.addEventListener("keydown", (e) => (this.evenResize = e.shiftKey));
    document.addEventListener("keyup", (e) => (this.evenResize = e.shiftKey));

    for (const handler of this.handlers) {
      const dataset: HandlerElementDataset = handler.dataset;
      const resizeOrigin = dataset.resizeDir;
      if (!resizeOrigin) {
        console.warn(
          "Resize handler does not include resize origin attribute and will be ignored"
        );
        continue;
      }

      handler.addEventListener(
        "mousedown",
        (e: MouseEvent) => {
          this.saveStartState(e, resizeOrigin);
          this.resizeStartListeners.forEach((cb) => cb(this.element));
          const cb = (e: MouseEvent) => {
            this.resize(e);
          };
          document.addEventListener("mousemove", cb);
          document.addEventListener(
            "mouseup",
            () => {
              document.removeEventListener("mousemove", cb);
              this.resizeEndListeners.forEach((cb) => cb(this.element));
            },
            { once: true }
          );
        },
        true
      );
    }
  }

  private resize(e: MouseEvent) {
    const deltaX = e.x - this.startState.mouseX;
    const deltaY = e.y - this.startState.mouseY;

    const updatedSize = {
      height: this.startState.height + deltaY,
      width: this.startState.width + deltaX,
    };

    this.applyTransformation(
      this.keepInBounds(this.applyEvenResizeIfActive(updatedSize))
    );

    this.resizeListeners.forEach((cb) => cb(this.element));
  }

  private applyEvenResizeIfActive(size: UpdatedSize) {
    if (!this.isResizeEvenly()) return size;

    const maxSide = Math.max(Math.abs(size.width), Math.abs(size.height));

    const newWidth =
      maxSide === Math.abs(size.height)
        ? Math.abs(this.startState.aspectRatio.getMatchingWidth(size.height)) *
          (Math.sign(size.width) || 1)
        : size.width;

    const newHeight =
      maxSide === Math.abs(size.width)
        ? Math.abs(this.startState.aspectRatio.getMatchingHeight(size.width)) *
          (Math.sign(size.height) || 1)
        : size.height;

    return {
      height: newHeight,
      width: newWidth,
    };
  }

  private keepInBounds(size: UpdatedSize): UpdatedSize {
    const boundedHeight = Math.max(
      Math.min(size.height, this.startState.maxHeight),
      this.startState.minHeight
    );
    const boundedWidth = Math.max(
      Math.min(size.width, this.startState.maxWidth),
      this.startState.minWidth
    );

    if (!this.isResizeEvenly()) {
      return { height: boundedHeight, width: boundedWidth };
    }

    const evenWidth =
      this.startState.aspectRatio.getMatchingWidth(Math.abs(boundedHeight)) *
      (Math.sign(size.width) || 1);

    const evenBoundedWidth = Math.max(
      Math.min(evenWidth, this.startState.maxWidth),
      this.startState.minWidth
    );
    const evenBoundedHeight =
      this.startState.aspectRatio.getMatchingHeight(
        Math.abs(evenBoundedWidth)
      ) * (Math.sign(size.height) || 1);

    return {
      height: evenBoundedHeight,
      width: evenBoundedWidth,
    };
  }

  private applyTransformation(size: UpdatedSize) {
    const newTop =
      this.startState.top +
      (Math.min(size.height, 0) - Math.min(this.startState.height, 0));
    const newLeft =
      this.startState.left +
      (Math.min(size.width, 0) - Math.min(this.startState.width, 0));

    this.element.style.top = this.getTopPercent(newTop);
    this.element.style.height = this.getHeightPercent(Math.abs(size.height));
    this.element.style.left = this.getLeftPercent(newLeft);
    this.element.style.width = this.getWidthPercent(Math.abs(size.width));

    this.element.classList.toggle(
      "flipped-w",
      Math.sign(size.width) != Math.sign(this.startState.width) &&
        !this.startState.flippedX
    );
    this.element.classList.toggle(
      "flipped-h",
      Math.sign(size.height) != Math.sign(this.startState.height) &&
        !this.startState.flippedY
    );
  }

  private getLeftPercent(left: number): string {
    return `${(left / this.bounds.clientWidth) * 100}%`;
  }

  private getTopPercent(top: number): string {
    return `${(top / this.bounds.clientHeight) * 100}%`;
  }

  private getHeightPercent(height: number): string {
    return `${(height / this.bounds.clientHeight) * 100}%`;
  }

  private getWidthPercent(width: number): string {
    return `${(width / this.bounds.clientWidth) * 100}%`;
  }

  private isResizeEvenly(): boolean {
    return this.evenResize;
  }

  private saveStartState(e: MouseEvent, resizeOrigin: ResizeOrigin) {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const top = this.element.offsetTop;
    const left = this.element.offsetLeft;

    const signedHeight = ["topleft", "topright"].includes(resizeOrigin)
      ? -height
      : height;
    const signedWidth = ["topleft", "bottomleft"].includes(resizeOrigin)
      ? -width
      : width;

    const element = this.element;
    this.startState = {
      resizeOrigin: resizeOrigin,
      mouseX: e?.x ?? 0,
      mouseY: e?.y ?? 0,
      height: signedHeight,
      minHeight: -top + Math.min(signedHeight, 0),
      maxHeight:
        this.bounds.clientHeight - (top + height) + Math.max(signedHeight, 0),
      width: signedWidth,
      minWidth: -left + Math.min(signedWidth, 0),
      maxWidth:
        this.bounds.clientWidth - (left + width) + Math.max(signedWidth, 0),
      aspectRatio: new AspectRatio(width, height),
      left: left,
      top: top,
      flippedX: element.classList.contains("flipped-w"),
      flippedY: element.classList.contains("flipped-h"),
    };
  }
}

class AspectRatio {
  private ratio: number;
  constructor(width: number, height: number) {
    this.ratio = width / height;
  }

  getMatchingWidth(height: number) {
    return height * this.ratio;
  }

  getMatchingHeight(width: number) {
    return width / this.ratio;
  }
}
