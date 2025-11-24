'use client';

import { useState, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowRight,
  LoaderCircle,
  Sparkles,
  Bot,
  Save,
  Rocket,
} from 'lucide-react';
import {
  suggestShoppingList,
  type SuggestShoppingListOutput,
} from '@/ai/flows/suggest-shopping-list';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter as UiTableFooter,
} from '@/components/ui/table';

const ShoppingPromptSchema = z.object({
  prompt: z.string().min(10, 'Please enter a more detailed prompt.'),
});

export default function ShoppingListClient() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [shoppingList, setShoppingList] =
    useState<SuggestShoppingListOutput | null>(null);

  const form = useForm<z.infer<typeof ShoppingPromptSchema>>({
    resolver: zodResolver(ShoppingPromptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ShoppingPromptSchema>) {
    setShoppingList(null);
    startTransition(async () => {
      try {
        const result = await suggestShoppingList({ prompt: values.prompt });
        setShoppingList(result);
      } catch (e) {
        const error =
          e instanceof Error ? e.message : 'An unknown error occurred';
        toast({
          variant: 'destructive',
          title: 'Suggestion Failed',
          description: error,
        });
      }
    });
  }

  const totalCost = useMemo(() => {
    if (!shoppingList) return 0;
    return shoppingList.shoppingList.reduce((acc, item) => {
      const price =
        parseInt(item.estimatedPrice.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + price;
    }, 0);
  }, [shoppingList]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="text-primary" />
            Generate Shopping List
          </CardTitle>
          <CardDescription>
            Describe what you're looking for (e.g., "electronics and kitchen
            ware") and the AI will create a list of items and where to buy them
            cheap.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g., I need to get kitchen ware, electronics, and food stuffs"
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
                Generate List
                {!isPending && <ArrowRight />}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {isPending && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <LoaderCircle className="animate-spin" />
          <span>Generating your shopping list...</span>
        </div>
      )}
      {shoppingList && shoppingList.shoppingList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Items</CardTitle>
            <CardDescription>
              Here's a list of items based on your prompt, with estimated prices
              and the best places to buy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Suggested Market</TableHead>
                  <TableHead className="text-right">
                    Estimated Price (UGX)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shoppingList.shoppingList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.suggestedMarket}</TableCell>
                    <TableCell className="text-right">
                      {item.estimatedPrice}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <UiTableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total Estimated Cost
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">
                    {new Intl.NumberFormat('en-UG', {
                      style: 'currency',
                      currency: 'UGX',
                      minimumFractionDigits: 0,
                    }).format(totalCost)}
                  </TableCell>
                </TableRow>
              </UiTableFooter>
            </Table>
          </CardContent>
          <CardFooter className="justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => toast({ title: 'List Saved!', description: 'Your shopping list has been saved for later.' })}
            >
              <Save />
              Save List
            </Button>
            <Button
              onClick={() => toast({ title: 'Coming Soon!', description: 'Delivery and payment features are under development.' })}
            >
              <Rocket />
              Arrange Delivery
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
