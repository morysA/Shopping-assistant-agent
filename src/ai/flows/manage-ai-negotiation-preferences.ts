'use server';
/**
 * @fileOverview Manages AI negotiation preferences and strategies.
 *
 * - manageAiNegotiationPreferences - A function that allows users to set AI negotiation preferences.
 * - ManageAiNegotiationPreferencesInput - The input type for the manageAiNegotiationPreferences function.
 * - ManageAiNegotiationPreferencesOutput - The return type for the manageAiNegotiationPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ManageAiNegotiationPreferencesInputSchema = z.object({
  aggressiveness: z
    .enum(['low', 'medium', 'high'])
    .describe('The aggressiveness level of the AI negotiation strategy.'),
  acceptablePriceRange: z
    .number()
    .describe('The acceptable price range for the AI to negotiate within.'),
  additionalInstructions: z
    .string()
    .optional()
    .describe('Additional instructions for the AI negotiation strategy.'),
});
export type ManageAiNegotiationPreferencesInput = z.infer<
  typeof ManageAiNegotiationPreferencesInputSchema
>;

const ManageAiNegotiationPreferencesOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the preferences were successfully updated.'),
  message: z.string().describe('A message indicating the result of the operation.'),
});
export type ManageAiNegotiationPreferencesOutput = z.infer<
  typeof ManageAiNegotiationPreferencesOutputSchema
>;

export async function manageAiNegotiationPreferences(
  input: ManageAiNegotiationPreferencesInput
): Promise<ManageAiNegotiationPreferencesOutput> {
  return manageAiNegotiationPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manageAiNegotiationPreferencesPrompt',
  input: {schema: ManageAiNegotiationPreferencesInputSchema},
  output: {schema: ManageAiNegotiationPreferencesOutputSchema},
  prompt: `You are an AI preference management assistant. The user wants to configure the AI negotiation strategy with the following preferences:

Aggressiveness: {{{aggressiveness}}}
Acceptable Price Range: {{{acceptablePriceRange}}}
Additional Instructions: {{{additionalInstructions}}}

Based on these preferences, update the AI negotiation strategy and respond with a success message.
`,
});

const manageAiNegotiationPreferencesFlow = ai.defineFlow(
  {
    name: 'manageAiNegotiationPreferencesFlow',
    inputSchema: ManageAiNegotiationPreferencesInputSchema,
    outputSchema: ManageAiNegotiationPreferencesOutputSchema,
  },
  async input => {
    // Simulate updating the AI negotiation strategy based on the input.
    // In a real application, this would involve updating a database or configuration file.

    const {output} = await prompt(input);
    return output!;
  }
);
