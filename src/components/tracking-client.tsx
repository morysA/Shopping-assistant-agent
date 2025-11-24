'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  Bike,
  LoaderCircle,
  MapPin,
  Phone,
  ShoppingBasket,
  Store,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const trackingSteps = [
  {
    name: 'Order Placed',
    icon: ShoppingBasket,
    description: 'We have received your order.',
  },
  {
    name: 'Rider Assigned',
    icon: Bike,
    description: 'A rider is on their way to the market.',
  },
  {
    name: 'Items Purchased',
    icon: Store,
    description: 'The rider has purchased all your items.',
  },
  {
    name: 'Out for Delivery',
    icon: MapPin,
    description: 'Your items are on the way to you.',
  },
  {
    name: 'Delivered',
    icon: CheckCircle,
    description: 'Your order has been delivered.',
  },
];

export default function TrackingClient({ orderId }: { orderId: string }) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate order progress
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < trackingSteps.length - 1) {
          return prevStep + 1;
        }
        clearInterval(interval);
        return prevStep;
      });
    }, 5000); // Advance every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src="https://picsum.photos/seed/map-kampala/1200/800"
                alt="Kampala Map"
                layout="fill"
                objectFit="cover"
                data-ai-hint="map kampala"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded-md bg-background/80 px-4 py-2 text-foreground shadow-lg">
                  Map integration coming soon!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rider Details</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://picsum.photos/seed/rider/100/100" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-bold">Robert K.</p>
                <p className="text-sm text-muted-foreground">
                  Boda Plate: UFE 123X
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast({ title: 'Calling Rider...' })}
                >
                  <Phone /> Call Rider
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border pl-6">
                {trackingSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const Icon = step.icon;

                  return (
                    <li key={step.name} className="mb-8 ml-6">
                      <span
                        className={cn(
                          'absolute -left-9 flex h-12 w-12 items-center justify-center rounded-full bg-muted ring-8 ring-background',
                          isCompleted && 'bg-green-500/20 text-green-400',
                          isActive && 'bg-primary/20 text-primary'
                        )}
                      >
                        {isActive ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <Icon />
                        )}
                      </span>
                      <h3
                        className={cn(
                          'font-headline font-semibold',
                          isCompleted && 'text-green-400',
                          isActive && 'text-primary'
                        )}
                      >
                        {step.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
