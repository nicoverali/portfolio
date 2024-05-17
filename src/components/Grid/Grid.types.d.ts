type Breakpoints = "xs" | "sm" | "md" | "lg";
type PropertyValue = string | number | boolean;
type ColNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ColSize = ColNum | "auto";
type BreakpointProperty<T> = Partial<Record<Breakpoints, T>>;
type Align = "start" | "center" | "end" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around";
type Spacing =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";
type Offset = ColNum;
