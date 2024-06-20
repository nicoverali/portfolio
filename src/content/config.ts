import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      repository: z.optional(z.string()),
      demo: z.optional(z.string()),
      featured: z.object({
        image: image(),
        order: z.optional(z.number()),
        color: z.optional(z.string()),
        colorDark: z.optional(z.string()),
        hasMockup: z.optional(z.boolean()),
      }),
      screenshots: z.array(image()),
      techs: z.array(z.string()),
    }),
});

const experienceCollection = defineCollection({
  type: "data",
  schema: () =>
    z.object({
      company: z.string(),
      jobTitle: z.string(),
      from: z.string(),
      to: z.string(),
    }),
});

export const collections = {
  projects: projectsCollection,
  experience: experienceCollection,
};
