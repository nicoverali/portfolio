type Size = "xs" | "sm" | "md" | "lg";
type ColNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ColSize = ColNum | "auto";
type SizeProperty<T> = Partial<Record<Size, T>>;
type XAlignment = "start" | "center" | "end";
type YAlignment = "top" | "middle" | "bottom";
type GridSize = {
  col?: ColSize;
  offset?: ColNum;
};
