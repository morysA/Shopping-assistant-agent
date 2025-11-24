import TrackingClient from '@/components/tracking-client';

export default function TrackingPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Track Your Order
        </h1>
        <p className="text-muted-foreground">
          Order ID: #{params.orderId.substring(0, 8)}
        </p>
      </div>
      <TrackingClient orderId={params.orderId} />
    </div>
  );
}
