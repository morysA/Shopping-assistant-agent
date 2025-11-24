import DeliveryClient from '@/components/delivery-client';

export default function DeliveryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Arrange Delivery
        </h1>
        <p className="text-muted-foreground">
          Confirm your order details and where you want it delivered.
        </p>
      </div>
      <DeliveryClient />
    </div>
  );
}
