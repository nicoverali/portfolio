import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    logoIcon: z.optional(z.string()),
    about: z.string(),
    description: z.string(),
    repository: z.optional(z.string()),
    demo: z.optional(z.string()),
    featured: z.optional(z.boolean()),
    screenshots: z.array(z.string()),
    techs: z.array(z.string()),
  }),
});

export const collections = {
  projects: projectsCollection,
};
