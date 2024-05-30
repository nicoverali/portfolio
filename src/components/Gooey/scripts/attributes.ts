import { snakeToCamel } from "@scripts/utils/strings";

export const GOOEY_ATTR_DEBUG_ID = "gooey-debug-id";
export const GOOEY_ATTR_DEBUG = "gooey-debug";
export const GOOEY_ATTR_PADDING = "gooey-padding";
export const GOOEY_CLASS_NAME = "gooey-container";

export const GOOEY_CAMEL_ATTR_DEBUG = snakeToCamel(GOOEY_ATTR_DEBUG);
export const GOOEY_CAMEL_ATTR_DEBUG_ID = snakeToCamel(GOOEY_ATTR_DEBUG_ID);
export const GOOEY_CAMEL_ATTR_PADDING = snakeToCamel(GOOEY_ATTR_PADDING);
