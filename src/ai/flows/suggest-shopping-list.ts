'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a shopping list based on a user's prompt.
 *
 * The flow takes a general description of shopping needs and returns a structured list of suggested items,
 * their categories, estimated prices, and the best markets in Kampala to find them.
 *
 * @interface SuggestShoppingListInput - The input type for the suggestShoppingList function.
 * @interface SuggestShoppingListOutput - The output type for the suggestShoppingList function.
 * @function suggestShoppingList - The main function that triggers the shopping list suggestion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShoppingListInputSchema = z.object({
  prompt: z.string().describe('A user\'s description of their shopping needs (e.g., "kitchen ware and food stuffs").'),
});

export type SuggestShoppingListInput = z.infer<typeof SuggestShoppingListInputSchema>;

const ShoppingItemSchema = z.object({
  itemName: z.string().describe('The name of the suggested shopping item.'),
  category: z.string().describe('The category the item belongs to (e.g., "Kitchen Ware", "Electronics", "Food Stuffs").'),
  estimatedPrice: z.string().describe('The estimated price of the item in Ugandan Shillings (UGX).'),
  suggestedMarket: z.string().describe('The cheapest and most affordable market or area in Kampala to buy this item.'),
});

const SuggestShoppingListOutputSchema = z.object({
  shoppingList: z.array(ShoppingItemSchema).describe('A list of suggested shopping items.'),
});

export type SuggestShoppingListOutput = z.infer<typeof SuggestShoppingListOutputSchema>;

export async function suggestShoppingList(
  input: SuggestShoppingListInput
): Promise<SuggestShoppingListOutput> {
  return suggestShoppingListFlow(input);
}

const shoppingListPrompt = ai.definePrompt({
  name: 'shoppingListPrompt',
  input: {schema: SuggestShoppingListInputSchema},
  output: {schema: SuggestShoppingListOutputSchema},
  prompt: `You are an expert personal shopper for Kampala, Uganda. Your goal is to help users find the best and most affordable items.

A user has given you the following shopping prompt: "{{{prompt}}}"

Based on this, generate a list of specific items they might need. For each item, provide its category, an estimated price in UGX, and recommend the best market or area in Kampala (e.g., Kikuubo, Nakasero Market, Owino Market, Game Store) known for offering the cheapest prices for that item.
`,
});

const suggestShoppingListFlow = ai.defineFlow(
  {
    name: 'suggestShoppingListFlow',
    inputSchema: SuggestShoppingListInputSchema,
    outputSchema: SuggestShoppingListOutputSchema,
  },
  async input => {
    const {output} = await shoppingListPrompt(input);
    return output!;
  }
);
