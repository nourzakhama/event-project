import { z } from "zod";

// Updated event form schema
export const eventFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z
      .string()
      .min(3, "Description must be at least 3 characters long")
      .max(400, "Description must not exceed 400 characters"),
    location: z
      .string()
      .min(3, "Location must be at least 3 characters long")
      .max(400, "Location must not exceed 400 characters"),
    
    // Ensuring the start and end date are optional but also validating the relationship
    dateD: z.date().nullable().optional(),
    dateF: z.date().nullable().optional(),
    
    // Category ID will be validated as a string (or you can replace it with an enum or ID validation if necessary)
    category: z.string(),
    
    // Adding employees and resources as optional arrays of strings
    employees: z.string().optional(),
    resources: z.string().optional(),
    participants: z.string().optional(),
    imageUrl: z.string().optional(),
    prix: z.string().optional(),
    status: z.string().optional(),
    capacity: z.string().optional(),
  })
  .refine(
    (data) => 
      !data.dateD || !data.dateF || data.dateD <= data.dateF,
    {
      message: "End date must be after the start date",
      path: ["endDate"], // Attach the error to the endDate field
    }
  );