'use server';

/**
 * @fileOverview Negotiates the price of a product using an AI agent.
 *
 * - negotiateProductPrice - A function that initiates the price negotiation process.
 * - NegotiateProductPriceInput - The input type for the negotiateProductPrice function.
 * - NegotiateProductPriceOutput - The return type for the negotiateProductPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NegotiateProductPriceInputSchema = z.object({
  productLink: z.string().describe('The link to the product to negotiate.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Any specific preferences or negotiation strategies the user wants to apply.'),
});
export type NegotiateProductPriceInput = z.infer<typeof NegotiateProductPriceInputSchema>;

const NegotiateProductPriceOutputSchema = z.object({
  negotiationStatus: z.string().describe('The current status of the negotiation.'),
  negotiatedPrice: z.string().optional().describe('The final negotiated price, if successful.'),
  summary: z.string().describe('A summary of the negotiation process.'),
});
export type NegotiateProductPriceOutput = z.infer<typeof NegotiateProductPriceOutputSchema>;

export async function negotiateProductPrice(input: NegotiateProductPriceInput): Promise<NegotiateProductPriceOutput> {
  return negotiateProductPriceFlow(input);
}

const negotiateProductPricePrompt = ai.definePrompt({
  name: 'negotiateProductPricePrompt',
  input: {schema: NegotiateProductPriceInputSchema},
  output: {schema: NegotiateProductPriceOutputSchema},
  prompt: `You are a skilled negotiator AI, tasked with getting the best possible price for a product.

You will be provided with a link to the product and any user preferences.

Product Link: {{{productLink}}}
User Preferences: {{{userPreferences}}}

Negotiate the price of the product, and provide updates on the negotiation status as it progresses. Strive to get the lowest price possible.
Once the negotiation is complete, or if you are unable to negotiate a lower price, provide a final negotiated price (if successful) and a summary of the negotiation process.

Respond with the negotiation status, the negotiated price (if available), and a summary of the negotiation process.
`,
});

const negotiateProductPriceFlow = ai.defineFlow(
  {
    name: 'negotiateProductPriceFlow',
    inputSchema: NegotiateProductPriceInputSchema,
    outputSchema: NegotiateProductPriceOutputSchema,
  },
  async input => {
    const {output} = await negotiateProductPricePrompt(input);
    return output!;
  }
);
