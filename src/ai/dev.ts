import { config } from 'dotenv';
config();

import '@/ai/flows/negotiate-product-price.ts';
import '@/ai/flows/generate-upsell-suggestions.ts';
import '@/ai/flows/manage-ai-negotiation-preferences.ts';