import DashboardClient from '@/components/dashboard-client';

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Start a new negotiation or view your history.
        </p>
      </div>
      <DashboardClient />
    </div>
  );
}
