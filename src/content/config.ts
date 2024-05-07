import { defineCollection, z } from "astro:content";

const featureProjectsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    logoIcon: z.optional(z.string()),
    about: z.string(),
    repository: z.optional(z.string()),
    demo: z.optional(z.string()),
    screenshots: z.array(z.string()),
    techs: z.array(z.string()),
  }),
});

export const collections = {
  "featured-projects": featureProjectsCollection,
};
