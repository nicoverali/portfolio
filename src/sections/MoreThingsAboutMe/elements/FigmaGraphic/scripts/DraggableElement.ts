interface DraggableStartState {
  mouseX: number;
  mouseY: number;
  left: number;
  top: number;
  maxLeft: number;
  maxTop: number;
}

type OnDragCallback = (e: HTMLElement) => void;

export default class DraggableElement {
  private element: HTMLElement;
  private bounds: HTMLElement;
  private startState!: DraggableStartState;
  private singleAxis: boolean = false;

  private dragStartListeners: OnDragCallback[] = [];
  private dragListeners: OnDragCallback[] = [];
  private dragEndListeners: OnDragCallback[] = [];

  constructor(element: HTMLElement, bounds: HTMLElement) {
    this.element = element;
    this.bounds = bounds;

    this.setupListeners();
  }

  private setupListeners() {
    document.addEventListener("keydown", (e) => (this.singleAxis = e.shiftKey));
    document.addEventListener("keyup", (e) => (this.singleAxis = e.shiftKey));

    this.element.addEventListener("pointerdown", (e: MouseEvent) => {
      if (e.target !== this.element) return;

      this.saveStartState(e);
      this.dragStartListeners.forEach((cb) => cb(this.element));
      const cb = (e: MouseEvent) => this.drag(e);
      document.addEventListener("pointermove", cb);
      document.addEventListener(
        "pointerup",
        () => {
          document.removeEventListener("pointermove", cb);
          this.dragEndListeners.forEach((cb) => cb(this.element));
        },
        { once: true }
      );
    });
  }

  onDragStart(cb: OnDragCallback) {
    this.dragStartListeners.push(cb);
  }

  onDrag(cb: OnDragCallback) {
    this.dragListeners.push(cb);
  }

  onDragEnd(cb: OnDragCallback) {
    this.dragEndListeners.push(cb);
  }

  private drag(e: MouseEvent) {
    const deltaX = e.x - this.startState.mouseX;
    const deltaY = e.y - this.startState.mouseY;
    const isDeltaXBigger = Math.abs(deltaX) > Math.abs(deltaY);

    const newLeft =
      this.singleAxis && !isDeltaXBigger
        ? this.startState.left
        : this.startState.left + deltaX;
    const newTop =
      this.singleAxis && isDeltaXBigger
        ? this.startState.top
        : this.startState.top + deltaY;

    const boundedLeft = Math.max(Math.min(newLeft, this.startState.maxLeft), 0);
    const boundedTop = Math.max(Math.min(newTop, this.startState.maxTop), 0);

    this.element.style.left = this.getLeftPercent(boundedLeft);
    this.element.style.top = this.getTopPercent(boundedTop);

    this.dragListeners.forEach((cb) => cb(this.element));
  }

  private getLeftPercent(left: number): string {
    return `${(left / this.bounds.clientWidth) * 100}%`;
  }

  private getTopPercent(top: number): string {
    return `${(top / this.bounds.clientHeight) * 100}%`;
  }

  private saveStartState(e: MouseEvent) {
    this.startState = {
      mouseX: e.x,
      mouseY: e.y,
      left: this.element.offsetLeft,
      top: this.element.offsetTop,
      maxLeft: this.bounds.clientWidth - this.element.clientWidth,
      maxTop: this.bounds.clientHeight - this.element.clientHeight,
    };
  }
}
