
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
import { ProductURLSchema, PreferencesSchema } from './schemas';

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
