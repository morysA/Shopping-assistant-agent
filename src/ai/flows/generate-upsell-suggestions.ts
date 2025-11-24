'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating tailored upsell suggestions based on a given product description.
 *
 * The flow takes a product description as input and returns a list of upsell suggestions.
 *
 * @interface GenerateUpsellSuggestionsInput - The input type for the generateUpsellSuggestions function.
 * @interface GenerateUpsellSuggestionsOutput - The output type for the generateUpsellSuggestions function.
 * @function generateUpsellSuggestions - The main function that triggers the upsell suggestion generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUpsellSuggestionsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed description of the product for which upsell suggestions are desired.'),
});

export type GenerateUpsellSuggestionsInput = z.infer<
  typeof GenerateUpsellSuggestionsInputSchema
>;

const GenerateUpsellSuggestionsOutputSchema = z.object({
  upsellSuggestions: z
    .array(z.string())
    .describe('A list of product names that would be good upsell suggestions.'),
});

export type GenerateUpsellSuggestionsOutput = z.infer<
  typeof GenerateUpsellSuggestionsOutputSchema
>;

export async function generateUpsellSuggestions(
  input: GenerateUpsellSuggestionsInput
): Promise<GenerateUpsellSuggestionsOutput> {
  return generateUpsellSuggestionsFlow(input);
}

const upsellSuggestionsPrompt = ai.definePrompt({
  name: 'upsellSuggestionsPrompt',
  input: {schema: GenerateUpsellSuggestionsInputSchema},
  output: {schema: GenerateUpsellSuggestionsOutputSchema},
  prompt: `You are an expert in product recommendations and upselling.
  Given the following product description, generate a list of upsell suggestions that would complement the product and enhance the user's experience.
  Return the list of upsell suggestion names.

  Product Description: {{{productDescription}}}
  `,
});

const generateUpsellSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateUpsellSuggestionsFlow',
    inputSchema: GenerateUpsellSuggestionsInputSchema,
    outputSchema: GenerateUpsellSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await upsellSuggestionsPrompt(input);
    return output!;
  }
);
