import { z } from 'zod';

export const ProductURLSchema = z.object({
  productLink: z.string().url({ message: 'Please enter a valid product URL.' }),
});

export const ProductResearchSchema = z.object({
  productDescription: z.string().min(3, { message: 'Please describe the product you are looking for.' }),
});

export const PreferencesSchema = z.object({
  aggressiveness: z.enum(['low', 'medium', 'high']),
  acceptablePriceRange: z.coerce
    .number()
    .positive({ message: 'Price must be a positive number.' }),
  additionalInstructions: z.string().optional(),
});
