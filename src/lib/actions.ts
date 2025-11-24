
'use server';

import { z } from 'zod';
import {
  negotiateProductPrice,
  type NegotiateProductPriceOutput,
} from '@/ai/flows/negotiate-product-price';
import {
  generateUpsellSuggestions,
  type GenerateUpsellSuggestionsOutput,
} from '@/ai/flows/generate-upsell-suggestions';
import { manageAiNegotiationPreferences } from '@/ai/flows/manage-ai-negotiation-preferences';
import { ProductURLSchema, PreferencesSchema, ProductResearchSchema } from './schemas';
import { suggestShoppingList } from '@/ai/flows/suggest-shopping-list';
import { researchProductPrices, type ResearchProductPricesOutput } from '@/ai/flows/research-product-prices';

export type NegotiationResult = {
  negotiation: NegotiateProductPriceOutput;
  upsells: GenerateUpsellSuggestionsOutput;
};

export async function startNegotiationAction(
  values: z.infer<typeof ProductURLSchema>
): Promise<NegotiationResult> {
  const validatedFields = ProductURLSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid input.');
  }

  const { productLink } = validatedFields.data;

  try {
    const [negotiation, upsells] = await Promise.all([
      negotiateProductPrice({
        productLink,
      }),
      generateUpsellSuggestions({
        productDescription: `Product at ${productLink}`,
      }),
    ]);

    return { negotiation, upsells };
  } catch (error) {
    console.error('Error during negotiation action:', error);
    throw new Error('Failed to complete negotiation.');
  }
}

export async function updatePreferencesAction(
  values: z.infer<typeof PreferencesSchema>
) {
  const validatedFields = PreferencesSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid preference values.' };
  }

  try {
    const result = await manageAiNegotiationPreferences(validatedFields.data);
    return result;
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { success: false, message: 'Failed to update preferences.' };
  }
}

export async function researchProductAction(
  values: z.infer<typeof ProductResearchSchema>
): Promise<ResearchProductPricesOutput> {
  const validatedFields = ProductResearchSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid input for product research.');
  }

  try {
    const result = await researchProductPrices(validatedFields.data);
    return result;
  } catch (error) {
    console.error('Error during product research action:', error);
    throw new Error('Failed to complete product research.');
  }
}


const ShoppingPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

export async function getShoppingListAction(
  values: z.infer<typeof ShoppingPromptSchema>
) {
  const validatedFields = ShoppingPromptSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid input.');
  }

  try {
    const result = await suggestShoppingList(validatedFields.data);
    return result;
  } catch (error) {
    console.error('Error getting shopping list:', error);
    throw new Error('Failed to generate shopping list.');
  }
}
