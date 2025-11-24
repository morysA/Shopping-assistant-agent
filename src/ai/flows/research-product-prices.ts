'use server';

/**
 * @fileOverview This file defines a Genkit flow for researching product prices based on a user's description.
 *
 * The flow takes a product description, finds relevant products from various stores in Kampala
 * and online, and returns a structured list of options with prices.
 *
 * @interface ResearchProductPricesInput - The input type for the researchProductPrices function.
 * @interface ResearchProductPricesOutput - The output type for the researchProductPrices function.
 * @function researchProductPrices - The main function that triggers the product research flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResearchProductPricesInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A user\'s description of the product they want to find (e.g., "a 24 inch Samsung TV").'),
});

export type ResearchProductPricesInput = z.infer<
  typeof ResearchProductPricesInputSchema
>;

const ProductFindingSchema = z.object({
  productName: z.string().describe('The specific name of the product found.'),
  description: z.string().describe('A brief, one-sentence description of the product.'),
  price: z.string().describe('The price of the item in Ugandan Shillings (UGX), formatted like "UGX 1,200,000".'),
  store: z.string().describe('The name of the physical store in Kampala or the online store where the item can be purchased.'),
});

const ResearchProductPricesOutputSchema = z.object({
  products: z
    .array(ProductFindingSchema)
    .describe('A list of products that match the user\'s description.'),
});

export type ResearchProductPricesOutput = z.infer<
  typeof ResearchProductPricesOutputSchema
>;

export async function researchProductPrices(
  input: ResearchProductPricesInput
): Promise<ResearchProductPricesOutput> {
  return researchProductPricesFlow(input);
}

const researchPrompt = ai.definePrompt({
  name: 'researchProductPricesPrompt',
  input: {schema: ResearchProductPricesInputSchema},
  output: {schema: ResearchProductPricesOutputSchema},
  prompt: `You are an expert market researcher and personal shopper for Kampala, Uganda.
Your task is to find the best options for a product based on a user's request.

User's request: "{{{productDescription}}}"

Based on this, find 2-3 specific product options. For each option, provide:
1. The full product name.
2. A very brief one-sentence description.
3. The estimated price in Ugandan Shillings (UGX), formatted as a string like "UGX 1,200,000".
4. The name of a store in Kampala (e.g., Game, Shoprite, TMT) or a popular, accessible online store (e.g., Jumia, Kikuu) where it can be bought.

Return a list of these product findings.
`,
});

const researchProductPricesFlow = ai.defineFlow(
  {
    name: 'researchProductPricesFlow',
    inputSchema: ResearchProductPricesInputSchema,
    outputSchema: ResearchProductPricesOutputSchema,
  },
  async input => {
    const {output} = await researchPrompt(input);
    // In a real application, you might add steps here to scrape websites or query a database.
    // For now, the LLM will generate realistic but fictional data.
    return output!;
  }
);
