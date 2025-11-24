'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreditCard,
  Home,
  LoaderCircle,
  Phone,
  User,
  Wallet,
} from 'lucide-react';
import { type SuggestShoppingListOutput } from '@/ai/flows/suggest-shopping-list';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter as UiTableFooter,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const DeliverySchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a detailed address.'),
  paymentMethod: z.enum(['mobile_money', 'card']),
});

export default function DeliveryClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [shoppingList, setShoppingList] =
    useState<SuggestShoppingListOutput | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedList = localStorage.getItem('shoppingList');
      if (storedList) {
        setShoppingList(JSON.parse(storedList));
      } else {
        // If no list is found, redirect back to the shopping list page
        toast({
          variant: 'destructive',
          title: 'No items to deliver',
          description: 'Please create a shopping list first.',
        });
        router.push('/shopping-list');
      }
    } catch (error) {
      console.error('Failed to parse shopping list from localStorage', error);
      router.push('/shopping-list');
    }
  }, [router, toast]);

  const form = useForm<z.infer<typeof DeliverySchema>>({
    resolver: zodResolver(DeliverySchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      paymentMethod: 'mobile_money',
    },
  });

  const onSubmit = (values: z.infer<typeof DeliverySchema>) => {
    console.log('Order placed:', values);
    toast({
      title: 'Order Placed!',
      description: 'Your delivery is being arranged. Track your rider soon!',
    });
    // Here you would typically call an action to process the order
    // and redirect to a tracking page.
    localStorage.removeItem('shoppingList');
    router.push('/');
  };

  const totalCost = useMemo(() => {
    if (!shoppingList) return 0;
    return shoppingList.shoppingList.reduce((acc, item) => {
      const price =
        parseInt(item.estimatedPrice.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + price;
    }, 0);
  }, [shoppingList]);

  const deliveryFee = totalCost * 0.1; // Example: 10% delivery fee
  const grandTotal = totalCost + deliveryFee;

  if (!isClient || !shoppingList) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <LoaderCircle className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery & Payment Details</CardTitle>
            <CardDescription>
              Enter your information to complete the order.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="John Doe" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="07XX XXX XXX"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Your detailed street address, landmark, or GPS location"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Be as specific as possible for a faster delivery.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mobile_money">
                            <div className="flex items-center gap-2">
                              <Wallet /> Mobile Money
                            </div>
                          </SelectItem>
                          <SelectItem value="card">
                            <div className="flex items-center gap-2">
                              <CreditCard /> Credit/Debit Card
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full sm:w-auto">
                  Place Order & Pay{' '}
                  {new Intl.NumberFormat('en-UG', {
                    style: 'currency',
                    currency: 'UGX',
                    minimumFractionDigits: 0,
                  }).format(grandTotal)}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-64 overflow-y-auto pr-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shoppingList.shoppingList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.estimatedPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {new Intl.NumberFormat('en-UG', {
                    style: 'currency',
                    currency: 'UGX',
                    minimumFractionDigits: 0,
                  }).format(totalCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>
                  {new Intl.NumberFormat('en-UG', {
                    style: 'currency',
                    currency: 'UGX',
                    minimumFractionDigits: 0,
                  }).format(deliveryFee)}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total</span>
              <span className="text-primary">
                {new Intl.NumberFormat('en-UG', {
                  style: 'currency',
                  currency: 'UGX',
                  minimumFractionDigits: 0,
                }).format(grandTotal)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
