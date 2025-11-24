'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  ArrowRight,
  Bot,
  LoaderCircle,
  Sparkles,
  ShoppingBag,
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

type Negotiation = {
  id: string;
  productLink: string;
  status: 'pending' | 'success' | 'error';
  result?: NegotiationResult;
  error?: string;
  placeholderImage: (typeof PlaceHolderImages)[0];
};

export default function DashboardClient() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);

  const form = useForm<z.infer<typeof ProductURLSchema>>({
    resolver: zodResolver(ProductURLSchema),
    defaultValues: {
      productLink: '',
    },
  });

  function onSubmit(values: z.infer<typeof ProductURLSchema>) {
    const negotiationId = crypto.randomUUID();
    const randomImage =
      PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

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
        setNegotiations((prev) =>
          prev.map((n) =>
            n.id === negotiationId
              ? { ...n, status: 'success', result }
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {negotiations.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col"
              >
                <CardHeader>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                     <Image
                        src={item.placeholderImage.imageUrl}
                        alt={item.placeholderImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={item.placeholderImage.imageHint}
                      />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-headline">
                      {item.placeholderImage.description}
                    </CardTitle>
                    <CardDescription className="truncate text-xs">
                      {item.productLink}
                    </CardDescription>
                  </div>
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LoaderCircle className="animate-spin" />
                      <span>Negotiating...</span>
                    </div>
                  )}
                  {item.status === 'success' && item.result && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Status</span>
                           <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                            {item.result.negotiation.negotiationStatus}
                           </Badge>
                        </div>
                        {item.result.negotiation.negotiatedPrice && (
                           <div className="flex justify-between items-baseline">
                             <span className="text-sm text-muted-foreground">Final Price</span>
                             <span className="font-bold text-lg text-primary">
                               {item.result.negotiation.negotiatedPrice}
                             </span>
                           </div>
                        )}
                        <p className="text-sm text-muted-foreground pt-2 border-t border-dashed">
                           {item.result.negotiation.summary}
                        </p>
                      </div>
                      <Separator />
                       <div>
                        <h3 className="font-headline text-md mb-2 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-primary"/>
                          Upsell Suggestions
                          </h3>
                        <div className="flex flex-wrap gap-2">
                           {item.result.upsells.upsellSuggestions.map((suggestion, i) => (
                              <Badge key={i} variant="outline">{suggestion}</Badge>
                           ))}
                        </div>
                       </div>
                    </>
                  )}
                   {item.status === 'error' && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Status</span>
                           <Badge variant="destructive">
                            Failed
                           </Badge>
                        </div>
                        <p className="text-sm text-destructive">{item.error}</p>
                    </div>
                   )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
