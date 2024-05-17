export function getPropertyClasses<T extends PropertyValue>(
  prop: T | BreakpointProperty<T> | undefined,
  prefix?: string
): string[] {
  const breakpoints = ["xs", "sm", "md", "lg"] as const;
  const classes: string[] = [];

  if (prop == null) {
    return [];
  }
  if (typeof prop !== "object") {
    return [makeBreakpointClass("xs", prop, prefix)];
  }
  for (const bkp of breakpoints) {
    if (prop[bkp] != null) {
      classes.push(makeBreakpointClass(bkp, prop[bkp], prefix));
    }
  }
  return classes;
}

function makeBreakpointClass<T>(
  breakpoint: string,
  value: T,
  prefix?: string
): string {
  return `${prefix ? `${prefix}-` : ""}${breakpoint}-${value}`;
}
