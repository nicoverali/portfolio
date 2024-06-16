export interface Measure {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const measureToParent = (element: HTMLElement): Measure => {
  const parent = element.parentElement;
  if (!parent) throw new Error("Cannot measure an element without parent");

  return {
    top: element.offsetTop,
    left: element.offsetLeft,
    right: parent.clientWidth - (element.offsetLeft + element.clientWidth),
    bottom: parent.clientHeight - (element.offsetTop + element.clientHeight),
  };
};

export default measureToParent;
