'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  ArrowRight,
  Bot,
  LoaderCircle,
  Sparkles,
  ShoppingBag,
  Tag,
  Rocket,
  PlusCircle,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { ProductURLSchema } from '@/lib/schemas';
import { startNegotiationAction, type NegotiationResult } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type Negotiation = {
  id: string;
  productLink: string;
  status: 'pending' | 'success' | 'error';
  result?: NegotiationResult;
  error?: string;
  placeholderImage: (typeof PlaceHolderImages)[0];
  displayData?: {
    originalPrice: number;
    negotiatedPrice: number;
    savings: number;
    currency: string;
  };
};

function parsePrice(priceString: string | undefined): { amount: number; currency: string } {
  if (!priceString) return { amount: 0, currency: 'UGX' };
  const currency = priceString.match(/[A-Z]{3}/)?.[0] || 'UGX';
  const amount = parseInt(priceString.replace(/[^0-9]/g, ''), 10) || 0;
  return { amount, currency };
}

export default function DashboardClient() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);


  const form = useForm<z.infer<typeof ProductURLSchema>>({
    resolver: zodResolver(ProductURLSchema),
    defaultValues: {
      productLink: '',
    },
  });

  function onSubmit(values: z.infer<typeof ProductURLSchema>) {
    const negotiationId = crypto.randomUUID();
    const randomImageIndex = Math.floor(Math.random() * PlaceHolderImages.length);
    const randomImage = PlaceHolderImages[randomImageIndex];

    setNegotiations((prev) => [
      {
        id: negotiationId,
        productLink: values.productLink,
        status: 'pending',
        placeholderImage: randomImage,
      },
      ...prev,
    ]);

    form.reset();

    startTransition(async () => {
      try {
        const result = await startNegotiationAction(values);
        
        // Simulate original price being higher
        const { amount: negotiatedPrice, currency } = parsePrice(result.negotiation.negotiatedPrice);
        const originalPrice = negotiatedPrice > 0 ? negotiatedPrice * (1 + (Math.random() * 0.3 + 0.1)) : 0; // 10-40% higher
        const savings = originalPrice - negotiatedPrice;

        setNegotiations((prev) =>
          prev.map((n) =>
            n.id === negotiationId
              ? { 
                  ...n, 
                  status: 'success', 
                  result,
                  displayData: {
                    originalPrice: Math.round(originalPrice),
                    negotiatedPrice,
                    savings: Math.round(savings),
                    currency,
                  }
                }
              : n
          )
        );
      } catch (e) {
        const error = e instanceof Error ? e.message : 'An unknown error occurred';
        setNegotiations((prev) =>
          prev.map((n) =>
            n.id === negotiationId ? { ...n, status: 'error', error } : n
          )
        );
        toast({
          variant: 'destructive',
          title: 'Negotiation Failed',
          description: error,
        });
      }
    });
  }

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="text-primary" />
            Start New Negotiation
          </CardTitle>
          <CardDescription>
            Enter a product link and let our AI assistant negotiate the best
            price for you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/product/..."
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Bargain Now
                {!isPending && <ArrowRight />}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {negotiations.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-bold">
            Negotiation History
          </h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {negotiations.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col"
              >
                <CardHeader className="flex-row gap-4 items-start space-y-0">
                  <div className="relative aspect-square w-24 overflow-hidden rounded-md flex-shrink-0">
                     <Image
                        src={item.placeholderImage.imageUrl}
                        alt={item.placeholderImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={item.placeholderImage.imageHint}
                      />
                  </div>
                   <div className="space-y-1 flex-grow">
                    <CardTitle className="text-lg font-headline leading-tight">
                      {item.placeholderImage.description}
                    </CardTitle>
                    <CardDescription className="truncate text-xs">
                      {item.productLink}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  
                  {item.status === 'pending' && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
                      <LoaderCircle className="animate-spin text-primary" />
                      <span className="font-medium">AI is negotiating for you...</span>
                    </div>
                  )}
                  {item.status === 'success' && item.result && item.displayData && (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-muted-foreground text-sm">
                            <span>Original Price</span>
                            <span className="line-through">
                              {new Intl.NumberFormat('en-UG', { style: 'currency', currency: item.displayData.currency, minimumFractionDigits: 0 }).format(item.displayData.originalPrice)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-primary font-bold text-lg">
                            <span>Negotiated Price</span>
                            <span>
                               {new Intl.NumberFormat('en-UG', { style: 'currency', currency: item.displayData.currency, minimumFractionDigits: 0 }).format(item.displayData.negotiatedPrice)}
                            </span>
                        </div>

                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                            <p className="font-bold text-xl text-green-300">
                              You Saved {new Intl.NumberFormat('en-UG', { style: 'currency', currency: item.displayData.currency, minimumFractionDigits: 0 }).format(item.displayData.savings)}!
                            </p>
                        </div>
                         <p className="text-xs text-muted-foreground pt-2 border-t border-dashed">
                           {item.result.negotiation.summary}
                        </p>
                      </div>
                      <Separator />
                       <div className="space-y-3">
                        <h3 className="font-headline text-md flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-primary"/>
                          Smart Upsell Suggestions
                          </h3>
                        <div className="flex flex-wrap gap-2">
                           {item.result.upsells.upsellSuggestions.map((suggestion, i) => (
                              <Button key={i} variant="outline" size="sm" className="h-auto py-1">
                                <PlusCircle className="mr-1 h-3 w-3" />
                                {suggestion}
                              </Button>
                           ))}
                        </div>
                       </div>
                    </>
                  )}
                   {item.status === 'error' && (
                    <div className="space-y-2 text-center py-8">
                       <Badge variant="destructive">
                        Negotiation Failed
                       </Badge>
                       <p className="text-sm text-destructive">{item.error}</p>
                    </div>
                   )}
                </CardContent>
                 {item.status === 'success' && (
                  <CardFooter className="bg-card-foreground/5 border-t">
                      <Button className="w-full">
                        <Rocket />
                        Proceed to Delivery
                      </Button>
                  </CardFooter>
                 )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

    