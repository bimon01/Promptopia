import { z } from "zod";

export const PostSchema = z.object({
  id: z.string().optional(),
  tag: z
    .array(z.string())
    .min(1, "At least one tag is required.")
    .max(5, "Maximum of 5 tags are allowed."),
  message: z
    .string()
    .min(3, "The post message must be at least 3 characters long."),
  creator: z.string(),
  imageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type IPost = z.infer<typeof PostSchema>;
