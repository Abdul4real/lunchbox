import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email("Invalid email"),
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});
