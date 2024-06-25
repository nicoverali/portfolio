/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare interface OgProps {
  title?: string;
  description?: string;
  image?: string;
  locale?: string;
}

declare const gsap: typeof import("gsap");
